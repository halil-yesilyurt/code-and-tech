declare module 'isomorphic-dompurify' {
  import { Config } from 'dompurify';
  
  interface DOMPurify {
    sanitize(source: string, config?: Config): string;
  }
  
  const DOMPurify: DOMPurify;
  export default DOMPurify;
}
