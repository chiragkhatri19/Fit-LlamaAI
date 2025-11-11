import React from 'react';
import {
  Upload,
  Loader2,
  Sparkles,
  AlertTriangle,
  Image as ImageIcon,
  RotateCcw,
  Lightbulb,
  CheckCircle2,
  Target,
  User,
  Dumbbell,
  Scale,
  Flame,
  PlusCircle,
  X,
  Search,
  Clock,
  Droplets,
  BadgeCheck,
  TrendingUp,
  Camera,
  Send,
  MessageCircle,
} from 'lucide-react';

// Props type for all icons
type IconProps = React.SVGProps<SVGSVGElement>;
type ImageIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

// Custom Llama icons (keep as images)
export const LlamaIcon: React.FC<ImageIconProps> = (props) => (
    <img src="/llama-icon.png" alt="Llama Icon" {...props} />
);

export const AnimatedLlamaLoader: React.FC<ImageIconProps> = (props) => (
    <>
    <style>{`
        @keyframes llama-bob {
            0%, 100% { transform: translateY(0) rotate(-2deg); }
            50% { transform: translateY(-3px) rotate(2deg); }
        }
        .llama-head-bob { animation: llama-bob 1.5s infinite ease-in-out; transform-origin: center; }
    `}</style>
    <img src="/llama-icon.png" alt="Llama Loading" className="llama-head-bob" {...props} />
    </>
);

export const LlamaCornerIllustration: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" {...props}>
        <g transform="translate(-20, 0) rotate(15, 50, 100)">
            <path d="M82.8,77.2c-2.4,1.8-5.1,3.3-7.9,4.4c-11.2,4.4-23.7,4.4-34.9,0c-2.8-1.1-5.5-2.6-7.9-4.4c-2-1.5-3.8-3.1-5.4-4.9c-9.1-9.9-9.1-26,0-35.8c1.6-1.8,3.4-3.4,5.4-4.9c4.9-3.6,10.6-6,16.8-6.9" fill="#3b82f6"/>
            <path d="M29.8 24.5c0 0 1.2-10.8 10-10.8" stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" fill="none"/>
            <circle cx="35" cy="41.4" r="6" fill="#1e293b"/>
        </g>
    </svg>
);

// Lucide React Icons - Modern and minimal
export const UploadIcon: React.FC<IconProps> = (props) => <Upload {...props} />;
export const LoaderIcon: React.FC<IconProps> = (props) => <Loader2 {...props} className={`animate-spin ${props.className || ''}`} />;
export const SparklesIcon: React.FC<IconProps> = (props) => <Sparkles {...props} />;
export const ErrorIcon: React.FC<IconProps> = (props) => <AlertTriangle {...props} />;
export const PhotoIcon: React.FC<IconProps> = (props) => <ImageIcon {...props} />;
export const ResetIcon: React.FC<IconProps> = (props) => <RotateCcw {...props} />;
export const LightbulbIcon: React.FC<IconProps> = (props) => <Lightbulb {...props} />;
export const CheckCircleIcon: React.FC<IconProps> = (props) => <CheckCircle2 {...props} />;
export const TargetIcon: React.FC<IconProps> = (props) => <Target {...props} />;
export const UserIcon: React.FC<IconProps> = (props) => <User {...props} />;
export const DumbbellIcon: React.FC<IconProps> = (props) => <Dumbbell {...props} />;
export const ScaleIcon: React.FC<IconProps> = (props) => <Scale {...props} />;
export const FireIcon: React.FC<IconProps> = (props) => <Flame {...props} />;
export const PlusCircleIcon: React.FC<IconProps> = (props) => <PlusCircle {...props} />;
export const CloseIcon: React.FC<IconProps> = (props) => <X {...props} />;
export const SearchIcon: React.FC<IconProps> = (props) => <Search {...props} />;
export const ClockIcon: React.FC<IconProps> = (props) => <Clock {...props} />;
export const WaterDropIcon: React.FC<IconProps> = (props) => <Droplets {...props} />;
export const CheckBadgeIcon: React.FC<IconProps> = (props) => <BadgeCheck {...props} />;
export const TrendingUpIcon: React.FC<IconProps> = (props) => <TrendingUp {...props} />;
export const CameraIcon: React.FC<IconProps> = (props) => <Camera {...props} />;
export const PaperAirplaneIcon: React.FC<IconProps> = (props) => <Send {...props} />;
export const ChatBubbleLeftRightIcon: React.FC<IconProps> = (props) => <MessageCircle {...props} />;
