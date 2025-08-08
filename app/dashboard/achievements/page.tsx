"use client";

import type React from "react";

import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Award,
  GraduationCap,
  Calendar,
  Save,
} from "lucide-react";
import { usePortfolioStore } from "@/lib/store";
import type { Achievement } from "@/lib/types";
import { CustomInput } from "@/components/ui/custom-input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { usePageTitle } from "@/lib/hooks/use-page-title";
import { DashboardButton } from "@/components/ui/dashboard-button";

export default function AchievementsPage() {
  const { achievements, addAchievement, updateAchievement, deleteAchievement } =
    usePortfolioStore();
  const { showToast } = useToast();

  // Set dynamic page title
  usePageTitle({
    title: "Achievements",
    prefix: "Dashboard",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] =
    useState<Achievement | null>(null);
  const [formData, setFormData] = useState<Omit<Achievement, "id">>({
    title: "",
    description: "",
    date: "",
    type: "achievement",
    order: achievements.length + 1,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      type: "achievement",
      order: achievements.length + 1,
    });
    setEditingAchievement(null);
  };

  const openModal = (achievement?: Achievement) => {
    if (achievement) {
      setEditingAchievement(achievement);
      setFormData(achievement);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.date.trim()
    ) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    // Enforce 140 character limit on description
    if (formData.description.length > 140) {
      showToast("Description must be 140 characters or less", "error");
      return;
    }

    try {
      if (editingAchievement) {
        await updateAchievement(editingAchievement.id, formData);
        showToast("Achievement updated successfully!", "success");
      } else {
        await addAchievement(formData);
        showToast("Achievement added successfully!", "success");
      }
      closeModal();
    } catch (error) {
      showToast("Failed to save achievement", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this achievement?")) {
      try {
        await deleteAchievement(id);
        showToast("Achievement deleted successfully!", "success");
      } catch (error) {
        showToast("Failed to delete achievement", "error");
      }
    }
  };

  const sortedAchievements = [...achievements].sort((a, b) => {
    // Sort by date (newest first), then by order
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (dateA !== dateB) return dateB - dateA;
    return a.order - b.order;
  });

  const educationItems = sortedAchievements.filter(
    (item) => item.type === "education"
  );
  const achievementItems = sortedAchievements.filter(
    (item) => item.type === "achievement"
  );

  const renderAchievementCard = (achievement: Achievement) => (
    <div
      key={achievement.id}
      className="border border-white/20 rounded-xl p-6 bg-black/50 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors duration-200">
            {achievement.type === "education" ? (
              <GraduationCap className="w-6 h-6 text-blue-400" />
            ) : (
              <Award className="w-6 h-6 text-yellow-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold mb-2">{achievement.title}</h3>
            <p className="text-gray-400 text-sm mb-3 leading-relaxed">
              {achievement.description.length > 140
                ? `${achievement.description.substring(0, 140)}...`
                : achievement.description}
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                {achievement.date}
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  achievement.type === "education"
                    ? "bg-blue-400/20 text-blue-400"
                    : "bg-yellow-400/20 text-yellow-400"
                }`}
              >
                {achievement.type}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <DashboardButton
            variant="ghost"
            size="sm"
            onClick={() => openModal(achievement)}
          >
            <Edit className="w-4 h-4" />
          </DashboardButton>
          <DashboardButton
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(achievement.id)}
          >
            <Trash2 className="w-4 h-4" />
          </DashboardButton>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6 bg-black min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white font-mono tracking-wide">
            Milestones
          </h1>
          <p className="text-gray-400 mt-2 font-mono text-sm tracking-wide">
            Manage your achievements and educational background
          </p>
        </div>
        <DashboardButton onClick={() => openModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Achievement
        </DashboardButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Education Section */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <GraduationCap className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-semibold">Education</h2>
            <span className="text-sm text-gray-500 bg-white/5 px-2 py-1 rounded">
              {educationItems.length} items
            </span>
          </div>
          <div className="space-y-4">
            {educationItems.length === 0 ? (
              <div className="border border-white/20 rounded-xl p-8 text-center bg-black/30 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
                <GraduationCap className="w-8 h-8 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-500 text-sm mb-4">
                  No education entries yet
                </p>
                <DashboardButton
                  size="sm"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, type: "education" }));
                    openModal();
                  }}
                >
                  Add Education
                </DashboardButton>
              </div>
            ) : (
              educationItems.map(renderAchievementCard)
            )}
          </div>
        </div>

        {/* Achievements Section */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-semibold">Achievements</h2>
            <span className="text-sm text-gray-500 bg-white/5 px-2 py-1 rounded">
              {achievementItems.length} items
            </span>
          </div>
          <div className="space-y-4">
            {achievementItems.length === 0 ? (
              <div className="border border-white/20 rounded-xl p-8 text-center bg-black/30 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
                <Award className="w-8 h-8 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-500 text-sm mb-4">
                  No achievements yet
                </p>
                <DashboardButton
                  size="sm"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, type: "achievement" }));
                    openModal();
                  }}
                >
                  Add Achievement
                </DashboardButton>
              </div>
            ) : (
              achievementItems.map(renderAchievementCard)
            )}
          </div>
        </div>
      </div>

      {/* Achievement Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-2xl bg-black border border-white text-white">
          <DialogHeader>
            <DialogTitle>
              {editingAchievement ? "Edit Achievement" : "Add New Achievement"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "education" | "achievement") =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger className="bg-black text-white border border-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-black border border-white">
                  <SelectItem
                    value="education"
                    className="text-white hover:bg-white/10"
                  >
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-blue-400" />
                      Education
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="achievement"
                    className="text-white hover:bg-white/10"
                  >
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-400" />
                      Achievement
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <CustomInput
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="e.g., Bachelor of Computer Science, Best Design Award"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description * (Max 140 characters)
              </Label>
              <div className="relative">
                <CustomInput
                  variant="textarea"
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Provide details about this achievement or education..."
                  rows={4}
                  maxLength={140}
                  required
                />
                <div
                  className={`absolute bottom-2 right-2 text-xs ${
                    formData.description.length > 140
                      ? "text-red-400"
                      : formData.description.length > 120
                      ? "text-yellow-400"
                      : "text-gray-500"
                  }`}
                >
                  {formData.description.length}/140
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Keep your description concise and impactful. This helps maintain
                consistent display across your portfolio.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <CustomInput
                id="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                placeholder="e.g., 2023, June 2023, 2020-2024"
                required
              />
              <p className="text-xs text-gray-500">
                You can use any format: year only (2023), month/year (June
                2023), or range (2020-2024)
              </p>
            </div>

            <div className="flex gap-4">
              <DashboardButton
                type="submit"
                disabled={formData.description.length > 140}
              >
                <Save className="w-4 h-4 mr-2" />
                {editingAchievement ? "Update Achievement" : "Add Achievement"}
              </DashboardButton>
              <DashboardButton
                type="button"
                variant="outline"
                onClick={closeModal}
              >
                Cancel
              </DashboardButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
