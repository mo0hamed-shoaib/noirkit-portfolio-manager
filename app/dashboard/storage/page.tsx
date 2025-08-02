"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  getStorageStats,
  listProfileImages,
  listProjectImages,
  listCVFiles,
  deleteProfileImage,
  deleteProjectImage,
  deleteCVFile,
  DatabaseFile,
} from "@/lib/storage-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Image,
  User,
  RefreshCw,
  Database,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface StorageStats {
  profileImages: number;
  projectImages: number;
  cvFiles: number;
}

export default function StoragePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<StorageStats>({
    profileImages: 0,
    projectImages: 0,
    cvFiles: 0,
  });
  const [profileFiles, setProfileFiles] = useState<DatabaseFile[]>([]);
  const [projectFiles, setProjectFiles] = useState<DatabaseFile[]>([]);
  const [cvFiles, setCvFiles] = useState<DatabaseFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    file: DatabaseFile | null;
    type: "profile" | "project" | "cv" | null;
  }>({
    isOpen: false,
    file: null,
    type: null,
  });

  const loadStorageData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [statsData, profileData, projectData, cvData] = await Promise.all([
        getStorageStats(),
        listProfileImages(user.id),
        listProjectImages(user.id),
        listCVFiles(user.id),
      ]);

      setStats(statsData);
      setProfileFiles(profileData);
      setProjectFiles(projectData);
      setCvFiles(cvData);
    } catch (error) {
      console.error("Failed to load storage data:", error);
      toast({
        title: "Error",
        description: "Failed to load storage data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStorageData();
  }, [user]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTotalStorageSize = () => {
    const allFiles = [...profileFiles, ...projectFiles, ...cvFiles];
    return allFiles.reduce((total, file) => total + file.size, 0);
  };

  const handleDeleteClick = (
    file: DatabaseFile,
    type: "profile" | "project" | "cv"
  ) => {
    setDeleteDialog({
      isOpen: true,
      file,
      type,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.file || !deleteDialog.type || !user) return;

    setDeleteLoading(deleteDialog.file.id);
    setDeleteDialog({ isOpen: false, file: null, type: null });

    try {
      let result;
      switch (deleteDialog.type) {
        case "profile":
          result = await deleteProfileImage(user.id);
          break;
        case "project":
          result = await deleteProjectImage(deleteDialog.file.id);
          break;
        case "cv":
          result = await deleteCVFile(user.id);
          break;
        default:
          throw new Error("Invalid file type");
      }

      if (result.success) {
        toast({
          title: "Success",
          description: "File deleted successfully",
        });
        // Reload data to reflect changes
        await loadStorageData();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete file",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  const getDeleteDialogTitle = () => {
    if (!deleteDialog.file) return "";
    switch (deleteDialog.type) {
      case "profile":
        return "Delete Profile Image";
      case "project":
        return "Delete Project Image";
      case "cv":
        return "Delete CV File";
      default:
        return "Delete File";
    }
  };

  const getDeleteDialogDescription = () => {
    if (!deleteDialog.file) return "";
    return `Are you sure you want to delete "${deleteDialog.file.name}"? This action cannot be undone and the file will be permanently removed from your storage.`;
  };

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-400 font-mono">
          Please sign in to view storage.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-black min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-mono tracking-wide">
            Storage Management
          </h1>
          <p className="text-gray-400 mt-2 font-mono text-sm tracking-wide">
            View and manage your uploaded files (stored in database)
          </p>
        </div>
        <Button
          onClick={loadStorageData}
          disabled={loading}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-mono tracking-wide"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Storage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-white/20 bg-black/50 hover:border-white/40 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-semibold leading-none flex items-center gap-2 text-white font-mono tracking-wide">
              <User className="h-4 w-4 text-gray-400" />
              Profile Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-mono">
              {stats.profileImages}
            </div>
            <p className="text-gray-400 text-sm font-mono">Files uploaded</p>
          </CardContent>
        </Card>

        <Card className="border-white/20 bg-black/50 hover:border-white/40 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-semibold leading-none flex items-center gap-2 text-white font-mono tracking-wide">
              <Image className="h-4 w-4 text-gray-400" />
              Project Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-mono">
              {stats.projectImages}
            </div>
            <p className="text-gray-400 text-sm font-mono">Files uploaded</p>
          </CardContent>
        </Card>

        <Card className="border-white/20 bg-black/50 hover:border-white/40 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-semibold leading-none flex items-center gap-2 text-white font-mono tracking-wide">
              <FileText className="h-4 w-4 text-gray-400" />
              CV Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-mono">
              {stats.cvFiles}
            </div>
            <p className="text-gray-400 text-sm font-mono">Files uploaded</p>
          </CardContent>
        </Card>

        <Card className="border-white/20 bg-black/50 hover:border-white/40 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-semibold leading-none flex items-center gap-2 text-white font-mono tracking-wide">
              <Database className="h-4 w-4 text-gray-400" />
              Total Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-mono">
              {formatFileSize(getTotalStorageSize())}
            </div>
            <p className="text-gray-400 text-sm font-mono">Storage used</p>
          </CardContent>
        </Card>
      </div>

      {/* File Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Images */}
        <Card className="border-white/20 bg-black/50 hover:border-white/40 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white font-mono tracking-wide">
              <User className="h-5 w-5 text-gray-400" />
              Profile Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profileFiles.length === 0 ? (
              <p className="text-gray-400 text-sm font-mono">
                No profile images uploaded
              </p>
            ) : (
              <div className="space-y-2">
                {profileFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200"
                  >
                    <div>
                      <p className="font-medium text-sm text-white font-mono">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-400 font-mono">
                        Updated: {formatDate(file.updated_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-white/10 text-white border border-white/20 font-mono"
                      >
                        {formatFileSize(file.size)}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteClick(file, "profile")}
                        disabled={deleteLoading === file.id}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-1 h-8 w-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Project Images */}
        <Card className="border-white/20 bg-black/50 hover:border-white/40 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white font-mono tracking-wide">
              <Image className="h-5 w-5 text-gray-400" />
              Project Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            {projectFiles.length === 0 ? (
              <p className="text-gray-400 text-sm font-mono">
                No project images uploaded
              </p>
            ) : (
              <div className="space-y-2">
                {projectFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200"
                  >
                    <div>
                      <p className="font-medium text-sm text-white font-mono">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-400 font-mono">
                        Updated: {formatDate(file.updated_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-white/10 text-white border border-white/20 font-mono"
                      >
                        {formatFileSize(file.size)}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteClick(file, "project")}
                        disabled={deleteLoading === file.id}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-1 h-8 w-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* CV Files */}
        <Card className="lg:col-span-2 border-white/20 bg-black/50 hover:border-white/40 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white font-mono tracking-wide">
              <FileText className="h-5 w-5 text-gray-400" />
              CV Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cvFiles.length === 0 ? (
              <p className="text-gray-400 text-sm font-mono">
                No CV files uploaded
              </p>
            ) : (
              <div className="space-y-2">
                {cvFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200"
                  >
                    <div>
                      <p className="font-medium text-sm text-white font-mono">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-400 font-mono">
                        Updated: {formatDate(file.updated_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-white/10 text-white border border-white/20 font-mono"
                      >
                        {formatFileSize(file.size)}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteClick(file, "cv")}
                        disabled={deleteLoading === file.id}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-1 h-8 w-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) =>
          !open && setDeleteDialog({ isOpen: false, file: null, type: null })
        }
      >
        <AlertDialogContent className="bg-black border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white font-mono tracking-wide flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              {getDeleteDialogTitle()}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300 font-mono">
              {getDeleteDialogDescription()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 text-white border-white/20 hover:bg-white/20 font-mono">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white font-mono"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
