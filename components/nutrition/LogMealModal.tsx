import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { analyzeImage, searchFoodDatabase } from '../../services/geminiService';
import type { Meal, FoodItem, AnalysisResult, MealSlot, FoodSearchResult } from '../../types';
import { CloseIcon, SparklesIcon, PhotoIcon, LoaderIcon, ErrorIcon, UploadIcon, SearchIcon, CameraIcon, AnimatedLlamaLoader } from '../ui/Icons';
import { AnimatedModal } from '../ui/aceternity';
import CameraCapture from './CameraCapture';

interface Props {
  onClose: () => void;
  onAddMeal: (meal: Meal) => void;
  mealSlots: MealSlot[];
  activeMealSlotId: string;
}

type LogState = 'idle' | 'loading' | 'success' | 'error';

const LLAMA_MYTHS = [
    "Lorenzo says: Eating carbs makes you fat. Fact: Your body needs carbs for fuel! It's about choosing the right ones, like whole grains, not ditching them.",
    "Lorenzo says: You need to eat every 2-3 hours. Fact: Grazing all day isn't magic. Total daily calories and nutrition are what really count.",
    "Lorenzo says: 'Fat-free' is always the best choice. Fact: Hold your llamas! Many fat-free foods are packed with sugar. Healthy fats are your friends.",
    "Lorenzo says: All calories are the same. Fact: A calorie from an apple and a calorie from a candy bar are on two totally different treks through your body.",
    "Lorenzo says: You have to chug a protein shake right after a workout. Fact: Your body isn't a ticking clock. Just get enough protein throughout your day.",
];

const AnalyzingLoader: React.FC = () => {
    const [mythIndex, setMythIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMythIndex(prev => (prev + 1) % LLAMA_MYTHS.length);
        }, 4000); // Change myth every 4 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center p-8 space-y-4 h-full">
            <AnimatedLlamaLoader className="w-24 h-24 text-blue-500" />
            <p className="font-semibold text-lg">Analyzing your meal...</p>
            <div className="text-gray-500 dark:text-gray-400 text-sm h-16 flex items-center">
                 <p className="animate-fade-in-out" key={mythIndex}>{LLAMA_MYTHS[mythIndex]}</p>
            </div>
        </div>
    );
};


const LogMealModal: React.FC<Props> = ({ onClose, onAddMeal, mealSlots, activeMealSlotId }) => {
    const [activeTab, setActiveTab] = useState<'ai' | 'manual'>('ai');
    const [selectedMealSlotId, setSelectedMealSlotId] = useState<string>(activeMealSlotId);
    
    // AI State
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [logState, setLogState] = useState<LogState>('idle');
    const [error, setError] = useState<string | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    // Manual State
    const [mealName, setMealName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<FoodSearchResult[]>([]);
    const [manualItems, setManualItems] = useState<FoodItem[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          handleFileSelect(file);
        }
    };

    const handleFileSelect = (file: File) => {
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setAnalysisResult(null);
        setError(null);
        setLogState('idle');
        setIsCameraOpen(false);
    };
    
    const handleAnalyzeClick = useCallback(async () => {
        if (!imageFile) return;
        setLogState('loading');
        setError(null);
        try {
          const result = await analyzeImage(imageFile);
          setAnalysisResult(result);
          setLogState('success');
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred.');
          setLogState('error');
        }
    }, [imageFile]);

    const handleQuantityChange = (itemId: string, newQuantityStr: string) => {
        const newQuantity = parseFloat(newQuantityStr);
        if (isNaN(newQuantity) || !analysisResult) return;

        const updatedItems = analysisResult.items.map(item => {
            if (item.id === itemId) {
                const ratio = newQuantity / (item.servingSizeUnit === 'ml' ? 100 : 100);
                return {
                    ...item,
                    servingSizeValue: newQuantity,
                    calories: Math.round(item.caloriesPer100g * ratio),
                    protein: Math.round(item.proteinPer100g * ratio),
                    carbs: Math.round(item.carbsPer100g * ratio),
                    fat: Math.round(item.fatPer100g * ratio),
                }
            }
            return item;
        });

        const newTotals = updatedItems.reduce((acc, item) => {
            acc.totalCalories += item.calories;
            acc.totalProtein += item.protein;
            acc.totalCarbs += item.carbs;
            acc.totalFat += item.fat;
            return acc;
        }, { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 });

        setAnalysisResult({ ...analysisResult, items: updatedItems, ...newTotals });
    };

    const mealTotals = useMemo(() => {
        if (!analysisResult) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
        return {
            calories: analysisResult.totalCalories,
            protein: analysisResult.totalProtein,
            carbs: analysisResult.totalCarbs,
            fat: analysisResult.totalFat,
        }
    }, [analysisResult]);


    const handleConfirmMeal = () => {
        if (!analysisResult) return;
        const newMeal: Meal = {
            id: new Date().toISOString(),
            mealSlotId: selectedMealSlotId,
            name: analysisResult.items.length > 1 ? `${analysisResult.items[0].name} & more` : analysisResult.items[0].name,
            items: analysisResult.items,
            totals: mealTotals,
            insights: analysisResult.insights,
        };
        onAddMeal(newMeal);
        onClose();
    };

    // --- Manual Mode Logic ---

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        setIsSearching(true);
        setSearchResults([]);
        try {
            const results = await searchFoodDatabase(searchQuery);
            setSearchResults(results);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to search.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleAddItem = (result: FoodSearchResult) => {
        const newItem: FoodItem = {
            id: `manual-${Date.now()}-${Math.random()}`,
            name: result.name,
            servingSizeValue: 100,
            servingSizeUnit: 'g',
            calories: result.caloriesPer100g,
            protein: result.proteinPer100g,
            carbs: result.carbsPer100g,
            fat: result.fatPer100g,
            ...result
        };
        setManualItems(prev => [...prev, newItem]);
        setSearchQuery('');
        setSearchResults([]);
    };
    
    const handleUpdateManualItemQuantity = (itemId: string, newQuantityStr: string) => {
        const newQuantity = parseFloat(newQuantityStr);
        if (isNaN(newQuantity)) return;

        setManualItems(prevItems => prevItems.map(item => {
            if (item.id === itemId) {
                const ratio = newQuantity / 100;
                return {
                    ...item,
                    servingSizeValue: newQuantity,
                    calories: Math.round(item.caloriesPer100g * ratio),
                    protein: Math.round(item.proteinPer100g * ratio),
                    carbs: Math.round(item.carbsPer100g * ratio),
                    fat: Math.round(item.fatPer100g * ratio),
                }
            }
            return item;
        }));
    };
    
    const handleRemoveManualItem = (itemId: string) => {
        setManualItems(prev => prev.filter(item => item.id !== itemId));
    };

    const manualMealTotals = useMemo(() => {
        return manualItems.reduce((acc, item) => {
            acc.calories += item.calories;
            acc.protein += item.protein;
            acc.carbs += item.carbs;
            acc.fat += item.fat;
            return acc;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    }, [manualItems]);


    const handleManualSubmit = () => {
        if (manualItems.length === 0) {
            alert("Please add at least one food item.");
            return;
        }

        const newMeal: Meal = {
            id: new Date().toISOString(),
            mealSlotId: selectedMealSlotId,
            name: mealName.trim() || manualItems[0].name,
            items: manualItems,
            totals: manualMealTotals,
            insights: ["Manually logged meal. AI insights not available."],
        };
        onAddMeal(newMeal);
        onClose();
    }

    if (isCameraOpen) {
        return <CameraCapture onCapture={handleFileSelect} onClose={() => setIsCameraOpen(false)} />
    }


  return (
    <>
      <style>{`
        .animate-fade-in-out {
          animation: fadeInOut 4s ease-in-out infinite;
        }
        @keyframes fadeInOut {
          0%, 100% { opacity: 0; }
          25%, 75% { opacity: 1; }
        }
      `}</style>
      <AnimatedModal isOpen={true} onClose={onClose}>
        <header className="flex justify-between items-center p-3 sm:p-4 border-b border-slate-200 dark:border-slate-700">
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Log a New Meal</h2>
                <select value={selectedMealSlotId} onChange={e => setSelectedMealSlotId(e.target.value)} className="bg-transparent text-sm text-blue-600 dark:text-blue-400 font-semibold focus:outline-none">
                    {mealSlots.map(slot => <option key={slot.id} value={slot.id}>{slot.name}</option>)}
                </select>
            </div>
        </header>
            <div className="p-4 sm:p-6 overflow-y-auto flex-grow">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
                <button onClick={() => setActiveTab('ai')} className={`px-4 py-2.5 font-semibold transition-all duration-200 ${activeTab === 'ai' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}>AI Scan</button>
                <button onClick={() => setActiveTab('manual')} className={`px-4 py-2.5 font-semibold transition-all duration-200 ${activeTab === 'manual' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}>Manual Entry</button>
            </div>

            {/* AI Tab Content */}
            {activeTab === 'ai' && (
                <div className="space-y-4">
                    {!previewUrl && (
                        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
                            <UploadIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Snap or Upload Your Meal</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Let your Llama Coach do the work. Use your camera or select a photo.</p>
                            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
                                <button onClick={() => setIsCameraOpen(true)} className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-slate-300 dark:border-slate-600 text-sm font-semibold rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 text-slate-700 dark:text-slate-300">
                                    <CameraIcon className="w-5 h-5 mr-2"/> Use Camera
                                </button>
                                <label htmlFor="file-upload" className="flex-1 cursor-pointer inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl shadow-md hover:shadow-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200">
                                    <PhotoIcon className="w-5 h-5 mr-2"/> Select Photo
                                </label>
                            </div>
                            <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                        </div>
                    )}

                    {previewUrl && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left: Image & Action */}
                            <div className="space-y-4">
                                <img src={previewUrl} alt="Meal preview" className="w-full h-auto object-cover rounded-lg shadow-md" />
                                <button
                                    onClick={handleAnalyzeClick}
                                    disabled={logState === 'loading'}
                                    className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-semibold rounded-xl shadow-md hover:shadow-lg text-white bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    {logState === 'loading' ? <LoaderIcon className="animate-spin w-5 h-5 mr-2" /> : <SparklesIcon className="w-5 h-5 mr-2" />}
                                    {logState === 'loading' ? 'Analyzing...' : (analysisResult ? 'Re-analyze' : 'Analyze Photo')}
                                </button>
                            </div>
                            {/* Right: Results */}
                            <div className="space-y-4">
                                {logState === 'loading' && <AnalyzingLoader />}
                                {logState === 'error' && <div className="p-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 rounded-r-lg flex items-center"><ErrorIcon className="w-6 h-6 mr-3"/>{error}</div>}
                                {logState === 'success' && analysisResult && (
                                    <div className="space-y-4 animate-fade-in">
                                        <h3 className="font-bold text-lg">Analysis Complete</h3>
                                        <div className="flex justify-around items-center text-center p-2 bg-gray-100 dark:bg-slate-700 rounded-lg">
                                            <div><p className="font-bold text-lg">{mealTotals.calories}</p><p className="text-xs">kcal</p></div>
                                            <div><p className="font-bold text-lg">{mealTotals.protein}</p><p className="text-xs text-sky-500">Protein</p></div>
                                            <div><p className="font-bold text-lg">{mealTotals.carbs}</p><p className="text-xs text-amber-500">Carbs</p></div>
                                            <div><p className="font-bold text-lg">{mealTotals.fat}</p><p className="text-xs text-lime-500">Fat</p></div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-md">Detected & Editable Items:</h4>
                                            <ul className="text-sm space-y-2 max-h-40 overflow-y-auto pr-2">
                                                {analysisResult.items.map((item) => (
                                                    <li key={item.id} className="p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-gray-600">
                                                        <div className="flex justify-between items-center font-semibold">
                                                            <span className="capitalize">{item.name}</span>
                                                            <span>{item.calories} kcal</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <input 
                                                                type="number"
                                                                value={item.servingSizeValue}
                                                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                                className="w-20 px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                                                            />
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">{item.servingSizeUnit}</span>
                                                        </div>
                                                        <div className="flex justify-end gap-4 text-xs mt-1">
                                                            <span className="text-sky-500 font-medium">P: {item.protein}g</span>
                                                            <span className="text-amber-500 font-medium">C: {item.carbs}g</span>
                                                            <span className="text-lime-500 font-medium">F: {item.fat}g</span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                         <p className="text-xs text-center text-gray-500 dark:text-gray-400 italic">{analysisResult.disclaimer}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Manual Tab Content */}
            {activeTab === 'manual' && (
                <div className="space-y-4">
                    <input type="text" placeholder="Meal Name (e.g., Post-workout shake)" value={mealName} onChange={e => setMealName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200" />
                    
                    {/* Search Bar */}
                    <form onSubmit={handleSearch}>
                        <div className="flex gap-2">
                            <input type="text" placeholder="Search for food (e.g., 'chicken breast')" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200" />
                            <button type="submit" disabled={isSearching} className="px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg">
                                {isSearching ? <LoaderIcon className="w-5 h-5 animate-spin"/> : <SearchIcon className="w-5 h-5"/>}
                            </button>
                        </div>
                    </form>

                    {/* Search Results */}
                    {isSearching && <p className="text-center text-gray-500">Searching...</p>}
                    {searchResults.length > 0 && (
                        <ul className="p-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg border dark:border-gray-600 max-h-48 overflow-y-auto space-y-1">
                            {searchResults.map((result, index) => (
                                <li key={index} onClick={() => handleAddItem(result)} className="p-3 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/40 cursor-pointer">
                                    <p className="font-semibold">{result.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{result.caloriesPer100g} kcal per 100g</p>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Meal Items */}
                    <div className="space-y-2">
                        {manualItems.map(item => (
                             <div key={item.id} className="p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-gray-600">
                                <div className="flex justify-between items-center font-semibold">
                                    <span className="capitalize">{item.name}</span>
                                    <button onClick={() => handleRemoveManualItem(item.id)}><CloseIcon className="w-4 h-4 text-gray-500 hover:text-red-500"/></button>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <input 
                                        type="number"
                                        value={item.servingSizeValue}
                                        onChange={(e) => handleUpdateManualItemQuantity(item.id, e.target.value)}
                                        className="w-20 p-1 rounded-md border-gray-300 dark:border-gray-500 bg-white dark:bg-slate-600 text-sm"
                                    />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{item.servingSizeUnit}</span>
                                </div>
                                <div className="flex justify-end gap-4 text-xs mt-1">
                                    <span className="text-red-500 font-medium">Kcal: {item.calories}</span>
                                    <span className="text-sky-500 font-medium">P: {item.protein}g</span>
                                    <span className="text-amber-500 font-medium">C: {item.carbs}g</span>
                                    <span className="text-lime-500 font-medium">F: {item.fat}g</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    {manualItems.length > 0 && (
                        <div className="flex justify-around items-center text-center p-2 bg-gray-100 dark:bg-slate-700 rounded-lg mt-4 font-semibold">
                            <div><p className="text-lg">{manualMealTotals.calories}</p><p className="text-xs">kcal</p></div>
                            <div><p className="text-lg">{manualMealTotals.protein}</p><p className="text-xs text-sky-500">Protein</p></div>
                            <div><p className="text-lg">{manualMealTotals.carbs}</p><p className="text-xs text-amber-500">Carbs</p></div>
                            <div><p className="text-lg">{manualMealTotals.fat}</p><p className="text-xs text-lime-500">Fat</p></div>
                        </div>
                    )}

                </div>
            )}
        </div>

        <footer className="p-4 border-t border-slate-200 dark:border-slate-700 mt-auto">
            {activeTab === 'ai' && (
                <button onClick={handleConfirmMeal} disabled={!analysisResult} className="w-full px-6 py-3.5 border border-transparent text-base font-semibold rounded-xl shadow-md hover:shadow-lg text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] disabled:transform-none">
                    Confirm & Add Meal
                </button>
            )}
             {activeTab === 'manual' && (
                <button onClick={handleManualSubmit} disabled={manualItems.length === 0} className="w-full px-6 py-3.5 border border-transparent text-base font-semibold rounded-xl shadow-md hover:shadow-lg text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] disabled:transform-none">
                    Add Manual Meal
                </button>
            )}
        </footer>
      </AnimatedModal>
    </>
  );
};

export default LogMealModal;

