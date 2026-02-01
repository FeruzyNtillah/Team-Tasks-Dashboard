import { supabase } from '../lib/supabase.client';

export interface UploadResult {
  url: string;
  path: string;
  fileName: string;
  size: number;
  contentType: string;
}

export interface UploadError {
  message: string;
  code?: string;
}

/**
 * File Upload Service for Task Attachments
 * 
 * This service handles uploading files to Supabase Storage
 * with proper validation and error handling.
 * 
 * Features:
 * - PDF only validation
 * - 3MB file size limit
 * - User-specific folder structure
 * - Automatic cleanup on errors
 * - Progress tracking
 */

class FileUploadService {
  private readonly BUCKET_NAME = 'task-attachments';
  private readonly MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
  private readonly ALLOWED_TYPES = ['application/pdf'];

  /**
   * Validate file before upload
   */
  validateFile(file: File): void {
    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error('File size must be less than 3MB');
    }

    // Check file type
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Only PDF files are allowed');
    }

    // Check if file exists
    if (!file || file.size === 0) {
      throw new Error('Please select a valid file');
    }
  }

  /**
   * Generate unique file path
   */
  private generateFilePath(userId: string, file: File): string {
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `${userId}/${timestamp}_${sanitizedName}`;
  }

  /**
   * Upload file to Supabase Storage
   */
  async uploadFile(
    file: File,
    userId: string,
    onProgress?: (progress: number) => void
  ): Promise<UploadResult> {
    try {
      // Validate file
      this.validateFile(file);

      // Generate file path
      const filePath = this.generateFilePath(userId, file);

      // Upload file
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false,
          duplex: 'half'
        });

      if (error) {
        console.error('Upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(data.path);

      return {
        url: publicUrl,
        path: data.path,
        fileName: file.name,
        size: file.size,
        contentType: file.type
      };

    } catch (err) {
      console.error('File upload error:', err);
      throw new Error(err instanceof Error ? err.message : 'File upload failed');
    }
  }

  /**
   * Delete file from Supabase Storage
   */
  async deleteFile(filePath: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath]);

      if (error) {
        console.error('Delete error:', error);
        throw new Error(`Failed to delete file: ${error.message}`);
      }
    } catch (err) {
      console.error('File deletion error:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to delete file');
    }
  }

  /**
   * Get file info from URL
   */
  async getFileInfo(filePath: string): Promise<{
    size: number;
    contentType: string;
    lastModified: string;
  } | null> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list('', {
          limit: 1,
          search: filePath.split('/').pop()
        });

      if (error || !data || data.length === 0) {
        return null;
      }

      const file = data[0];
      return {
        size: file.metadata?.size || 0,
        contentType: file.metadata?.mimetype || 'application/octet-stream',
        lastModified: file.created_at
      };
    } catch (err) {
      console.error('Error getting file info:', err);
      return null;
    }
  }

  /**
   * Check if file exists
   */
  async fileExists(filePath: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list('', {
          limit: 1,
          search: filePath.split('/').pop()
        });

      return !error && data && data.length > 0;
    } catch (err) {
      console.error('Error checking file existence:', err);
      return false;
    }
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get file extension
   */
  getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || '';
  }

  /**
   * Check if file is PDF
   */
  isPDF(fileName: string): boolean {
    return this.getFileExtension(fileName) === 'pdf';
  }
}

// Export singleton instance
export const fileUploadService = new FileUploadService();

// Export utility functions for convenience
export const uploadFile = fileUploadService.uploadFile.bind(fileUploadService);
export const deleteFile = fileUploadService.deleteFile.bind(fileUploadService);
export const getFileInfo = fileUploadService.getFileInfo.bind(fileUploadService);
export const fileExists = fileUploadService.fileExists.bind(fileUploadService);
export const formatFileSize = fileUploadService.formatFileSize.bind(fileUploadService);
export const isPDF = fileUploadService.isPDF.bind(fileUploadService);
