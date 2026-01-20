export class TextUtil {
  static removeSpace(text?: string) {
    return (text ?? '').replace(/\s+/g, '');
  }
}
