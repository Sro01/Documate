import ChatImageCard from './ChatImageCard';
import type { ChatImage } from '../../types/chat/chat';

interface ChatImagesRowProps {
  images: ChatImage[];
}

function ChatImagesRow({ images }: ChatImagesRowProps) {
  if (images.length === 0) return null;

  return (
    <div className="overflow-x-auto mb-3">
      <div className="flex gap-3">
        {images.map((img) => (
          <ChatImageCard key={img.id} image={img} />
        ))}
      </div>
    </div>
  );
}

export default ChatImagesRow;
