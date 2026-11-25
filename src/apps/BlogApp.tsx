import { LanguageProvider } from '../contexts/LanguageContext';
import Blog from '../pages/Blog';
import BlogPost from '../pages/BlogPost';

export default function BlogApp({ single }: { single?: boolean }) {
  return (
    <LanguageProvider>
      {single ? <BlogPost /> : <Blog />}
    </LanguageProvider>
  );
}
