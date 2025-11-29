import { supabase } from "@/lib/supabase";

const DEFAULT_BUCKET = "user-photos";

const createFileName = (originalName = "file") => {
  const extension = originalName.split(".").pop();
  const randomSuffix = Math.random().toString(36).slice(2, 8);
  return `${Date.now()}_${randomSuffix}.${extension || "bin"}`;
};

export const UploadFile = async ({
  file,
  bucket = DEFAULT_BUCKET,
  folder = "",
}) => {
  if (!file) {
    throw new Error("Nenhum arquivo selecionado para upload");
  }

  const fileName = createFileName(file.name);
  const filePath = folder ? `${folder}/${fileName}` : fileName;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { cacheControl: "3600", upsert: false });

  if (error) {
    throw error;
  }

  const { data } = await supabase.storage.from(bucket).getPublicUrl(filePath);

  return {
    file_url: data?.publicUrl,
    path: filePath,
    bucket,
  };
};
