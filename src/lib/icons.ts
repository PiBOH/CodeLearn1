import {
  Braces,
  Zap,
  Coffee,
  Smartphone,
  Apple,
  Gamepad2,
  Cpu,
  Terminal,
  Globe,
  FileCode,
  Code2,
} from 'lucide-react';

export const iconMap: Record<string, React.ElementType> = {
  Snake: Braces,
  Zap,
  Coffee,
  Smartphone,
  Apple,
  Gamepad2,
  Cpu,
  Terminal,
  Globe,
  FileCode,
};

export function getIcon(name: string) {
  return iconMap[name] || Code2;
}
