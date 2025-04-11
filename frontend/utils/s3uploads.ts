import axios from "axios";
import { ImagePickerAsset } from "expo-image-picker";

interface S3UploadResponse {
    url: string;
    key: string;
}

/**
 * Gets the appropriate MIME type from a file extension
 * @param fileExtension The file extension (without the dot)
 * @returns The corresponding MIME type
 */
export const getMimeType = (fileExtension?: string): string => {
    if (!fileExtension) return "octet-stream";

    const ext = fileExtension.toLowerCase();
    switch (ext) {
        case "jpg":
        case "jpeg":
            return "jpeg";
        case "png":
            return "png";
        case "gif":
            return "gif";
        case "webp":
            return "webp";
        case "pdf":
            return "pdf";
        default:
            return ext;
    }
};

/**
 * Uploads a file to S3 using a presigned URL
 * @param fileUri The local URI of the file to upload
 * @param presignedUrl The presigned URL for uploading
 * @param contentType The content type of the file
 * @returns A promise that resolves when the upload is complete
 */
export const uploadFileWithPresignedUrl = async (
    fileUri: string,
    presignedUrl: string,
    contentType: string,
): Promise<void> => {
    // Get the file data as a blob
    const response = await fetch(fileUri);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", presignedUrl, true);
        xhr.setRequestHeader("Content-Type", contentType);

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve();
            } else {
                reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
            }
        };

        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.onabort = () => reject(new Error("Upload aborted"));

        xhr.send(blob);
    });
};

/**
 * Gets a presigned URL from the backend for uploading to S3
 * @param fileType The MIME type of the file
 * @returns The presigned URL and key
 */
export const getPresignedUploadUrl = async (fileType: string): Promise<{ uploadUrl: string; key: string }> => {
    try {
        const { data } = await axios.post(
            `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/assets/upload`,
            {},
            {
                params: { fileType },
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            },
        );

        const { upload_url: uploadUrl, key } = data;

        if (!uploadUrl || !key) {
            throw new Error("Invalid presigned URL response");
        }

        return { uploadUrl, key };
    } catch (error) {
        console.error("Error getting presigned URL:", error);
        throw error;
    }
};

/**
 * Uploads an image to S3 via the backend presigned URL
 * @param image The image asset to upload
 * @returns The URL of the uploaded image
 */
export const uploadImageToS3 = async (image: ImagePickerAsset): Promise<string> => {
    try {
        // Get file extension and proper MIME type
        const fileExtension = image.uri.split(".").pop()?.toLowerCase();
        const fileType = getMimeType(fileExtension);

        // Get presigned URL from backend
        const { uploadUrl, key } = await getPresignedUploadUrl(fileType);

        // Upload file to S3 using the presigned URL
        await uploadFileWithPresignedUrl(image.uri, uploadUrl, fileType);

        // Construct and return the final S3 URL without any query parameters
        const bucketUrl = process.env.EXPO_PUBLIC_S3_BUCKET_URL || uploadUrl.split("?")[0];
        return `${bucketUrl}/${key}`;
    } catch (error) {
        console.error("Error uploading image to S3:", error);
        throw error;
    }
};

/**
 * Uploads multiple images to S3 in parallel
 * @param images Array of image assets to upload
 * @returns Array of uploaded image URLs
 */
export const uploadMultipleImagesToS3 = async (images: ImagePickerAsset[]): Promise<string[]> => {
    if (images.length === 0) return [];

    try {
        const uploadPromises = images.map(uploadImageToS3);
        return await Promise.all(uploadPromises);
    } catch (error) {
        console.error("Error uploading multiple images:", error);
        throw error;
    }
};
