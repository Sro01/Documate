import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../../components/common/Button';
import ChatbotTable from '../../../components/admin/chatbot/ChatbotList/ChatbotTable';
import ManualFileList from '../../../components/admin/manual/ManualFileList';
import type { Chatbot } from '../../../types/admin/chatbot';
import type { Manual, UploadingFile } from '../../../types/admin/manual';

function ManualPage() {
  const navigate = useNavigate();
  const { chatbotId } = useParams<{ chatbotId: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // TODO: API로 챗봇 정보 가져오기
  const [chatbot] = useState<Chatbot>({
    chatbot_id: chatbotId || '',
    name: '소비자 매뉴얼 챗봇',
    description: '',
    is_public: true,
    created_at: "2025-01-01T00:00:00Z"
  });

  // TODO: API로 매뉴얼 목록 가져오기
  const [manuals] = useState<Manual[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  const processFiles = (files: FileList | File[]) => {
    const pdfFiles = Array.from(files).filter(file => file.type === 'application/pdf');
    const newFiles = pdfFiles.map(file => ({
      file,
      display_name: file.name.replace('.pdf', ''),
    }));

    setUploadingFiles(prev => [...prev, ...newFiles]);

    // input 초기화하여 같은 파일도 다시 선택 가능하게
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateDisplayName = (index: number, newName: string) => {
    setUploadingFiles(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, display_name: newName } : item
      )
    );
  };


  const handleSubmit = () => {
    console.log('등록할 파일:', uploadingFiles);
    // TODO: 매뉴얼 등록 로직
    navigate('/admin/chatbotlist');
  };

  const handleCancel = () => {
    navigate('/admin/chatbotlist');
  };

  return (
    <main className="flex-1 p-8">
      <h1 className="text-2xl font-bold mb-6">매뉴얼 설정</h1>

      {/* 선택된 챗봇 정보 */}
      <div className="mb-6">
        <ChatbotTable chatbots={[chatbot]} />
      </div>

      {/* 파일 미리보기/관리 영역 */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`transition-all ${isDragging ? 'opacity-50' : ''}`}
      >
        <ManualFileList
          manuals={manuals}
          uploadingFiles={uploadingFiles}
          onRemoveFile={handleRemoveFile}
          onUpdateDisplayName={handleUpdateDisplayName}
          isDragging={isDragging}
        />
      </div>


      {/* PDF 추가 버튼 */}
      <div className="mb-6">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          pdf 추가
        </Button>
      </div>



      {/* 하단 버튼들 */}
      <div className="flex justify-end gap-3">
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={uploadingFiles.length === 0}
        >
          등록
        </Button>
        <Button variant="secondary" onClick={handleCancel}>
          취소
        </Button>
      </div>
    </main>
  );
}

export default ManualPage;
