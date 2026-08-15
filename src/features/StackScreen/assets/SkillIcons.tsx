
import React from 'react';
import * as ToolIcons from '../components/ToolIcons';

interface IconProps {
    className?: string;
    style?: React.CSSProperties;
}

// Maps 'iconKey' from data.ts to actual Component
export const SkillIcons: Record<string, React.FC<IconProps>> = {
    // 3D & GAME
    'blender': ToolIcons.BlenderIcon,
    'maya': ToolIcons.MayaIcon,
    'max': ToolIcons.ThreeDsMaxIcon, // 3ds max
    '3ds_max': ToolIcons.ThreeDsMaxIcon,
    '3dsmax': ToolIcons.ThreeDsMaxIcon,
    'zbrush': ToolIcons.ZBrushIcon,
    'zb-ipad': ToolIcons.ZBrushIcon,
    'marmo': ToolIcons.ThreeDsMaxIcon, // Generic 3D for Marmoset if no specific
    'keyshot': ToolIcons.ThreeDsMaxIcon,
    'vray': ToolIcons.ThreeDsMaxIcon,
    'magica': ToolIcons.ThreeDsMaxIcon,
    'anti': ToolIcons.ThreeDsMaxIcon,
    'unreal': ToolIcons.UnrealIcon,
    'unity': ToolIcons.UnityIcon,
    'sub_painter': ToolIcons.SubstancePainterIcon,
    'sub-pt': ToolIcons.SubstancePainterIcon,
    'sub_designer': ToolIcons.SubstanceDesignerIcon,
    'sub-ds': ToolIcons.SubstanceDesignerIcon,
    
    // Adobe / Graphic
    'photoshop': ToolIcons.PhotoshopIcon,
    'ps': ToolIcons.PhotoshopIcon,
    'illustrator': ToolIcons.IllustratorIcon,
    'ai': ToolIcons.IllustratorIcon,
    'indesign': ToolIcons.InDesignIcon,
    'id': ToolIcons.InDesignIcon,
    'after_effects': ToolIcons.AfterEffectsIcon,
    'ae': ToolIcons.AfterEffectsIcon,
    'premiere': ToolIcons.PremiereIcon,
    'premiere_pro': ToolIcons.PremiereIcon,
    'prem': ToolIcons.PremiereIcon,
    'xd': ToolIcons.AdobeXDIcon,
    'adobe_xd': ToolIcons.AdobeXDIcon,
    'audition': ToolIcons.AuditionIcon,
    'figma': ToolIcons.FigmaIcon,
    'affinity': ToolIcons.AffinityIcon,
    'aff-ph': ToolIcons.AffinityIcon,
    'aff-de': ToolIcons.AffinityIcon,
    'affinity_designer': ToolIcons.AffinityIcon,
    'aseprite': ToolIcons.AsepriteIcon,
    'ase': ToolIcons.AsepriteIcon,
    'canva': ToolIcons.CanvaIcon,
    'proc': ToolIcons.PhotoshopIcon, // Procreate fallback
    'pixel': ToolIcons.PhotoshopIcon, // Pixelmator fallback
    'spark': ToolIcons.AiVideoIcon, // Spark AR

    // Dev
    'react': ToolIcons.ReactIcon,
    'ts': ToolIcons.TypescriptIcon,
    'powershell': ToolIcons.PowerShellIcon,
    'tailwind': ToolIcons.TailwindIcon,
    'next': ToolIcons.NextIcon,
    'obs': ToolIcons.ObsIcon,
    'pure': ToolIcons.DatabaseIcon, // PureRef fallback

    // AI - LLM
    'gpt': ToolIcons.OpenAIIcon,
    'claude': ToolIcons.ClaudeIcon,
    'gemini': ToolIcons.AiBrainIcon,
    'grok': ToolIcons.AiBrainIcon,
    'mistral': ToolIcons.AiBrainIcon,
    'perp': ToolIcons.AiBrainIcon,
    'note': ToolIcons.AiBrainIcon,

    // AI - Art
    'mj': ToolIcons.MidjourneyIcon,
    'sd': ToolIcons.AiVideoIcon,
    'comfy': ToolIcons.AiVideoIcon,
    'leo': ToolIcons.AiVideoIcon,
    'krea': ToolIcons.AiVideoIcon,
    'magn': ToolIcons.AiVideoIcon,

    // AI - Dev
    'cursor': ToolIcons.PythonIcon,
    'copilot': ToolIcons.PythonIcon,
    'wind': ToolIcons.PythonIcon,
    'v0': ToolIcons.PythonIcon,
    'replit': ToolIcons.PythonIcon,
    'lovable': ToolIcons.PythonIcon,
    'bolt': ToolIcons.PythonIcon,

    // AI - Video/Audio
    'runway': ToolIcons.AiVideoIcon,
    'luma': ToolIcons.AiVideoIcon,
    'kling': ToolIcons.AiVideoIcon,
    'topaz': ToolIcons.AiVideoIcon,
    'pika': ToolIcons.AiVideoIcon,
    'eleven': ToolIcons.AiAudioIcon,
    'suno': ToolIcons.AiAudioIcon,
    'stable-aud': ToolIcons.AiAudioIcon,

    // AI - Local/Other
    'ollama': ToolIcons.TerminalIcon,
    'lmstudio': ToolIcons.TerminalIcon,
    'pinokio': ToolIcons.TerminalIcon,
    'anything': ToolIcons.TerminalIcon,
    'oss-ai': ToolIcons.TerminalIcon,
    'gamma': ToolIcons.AiBrainIcon,
};
