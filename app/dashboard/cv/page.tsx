import dynamic from 'next/dynamic';

// Dynamically import the CV page to prevent server-side rendering
const CVManagementPage = dynamic(() => import('./cv-content'), {
  ssr: false,
  loading: () => (
    <div className="p-6 space-y-6 bg-black min-h-screen">
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 text-sm">Loading CV Management...</p>
        </div>
      </div>
    </div>
  ),
});

export default CVManagementPage;
