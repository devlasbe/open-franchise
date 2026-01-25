export class TextUtil {
  static removeSpace(text?: string) {
    return (text ?? '').replace(/\s+/g, '');
  }

  static escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
