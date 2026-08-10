declare module "epubjs" {
  type Rendition = { display: () => Promise<void>; destroy?: () => void };
  type Book = { renderTo: (element: HTMLElement, options: { width: string; height: string; flow: string }) => Rendition };
  const ePub: (input: ArrayBuffer) => Book;
  export default ePub;
}
