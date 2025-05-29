"use client";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import Modal from "../Modal";
import Input from "../Inputs/Input";
import Image from "next/image";
import { CldUploadButton } from "next-cloudinary";
import Button from "../Button";
interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser?: User;
}
const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    currentUser,
}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            name: currentUser?.name,
            image: currentUser?.image,
        },
    });
    const image = watch("image"); //使用 react-hook-form 的 watch 函数来监听表单中 image 字段的值变化
    const handleUpload = (result: any) => {
        setValue("image", result?.info?.secure_url, {
            shouldValidate: true, //设置新值后要触发表单验证
        });
    };
    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
        axios
            .post("/api/settings", data)
            .then(() => {
                router.refresh();
                onClose();
            })
            .catch(() => toast.error("Something went wrong!"))
            .finally(() => setIsLoading(false));
    };
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2
                            className="
                        text-base 
                        font-semibold
                        leading-7
                        text-gray-900"
                        >
                            Profile
                        </h2>
                        <p
                            className="
                            mt-1 
                            text-sm 
                            leading-6 
                            text-gray-600"
                        >
                            Edit your public information
                        </p>
                        <div
                            className="
                        mt-10
                        flex
                        flex-col
                        gap-y-10"
                        >
                            <Input
                                type="text"
                                disabled={isLoading}
                                label="Name"
                                id="name"
                                errors={errors}
                                required
                                register={register}
                            />
                            <div>
                                <label
                                    className="
                                    block
                                    text-sm
                                    font-medium
                                    leading-6
                                    text-gray-900"
                                >
                                    Photo
                                </label>
                                <div
                                    className="
                                    mt-2
                                    flex
                                    items-center
                                    gap-x-3"
                                >
                                    <Image
                                        width="48"
                                        height="48"
                                        className="rounded-full"
                                        src={
                                            image ||
                                            currentUser?.image ||
                                            "/images/placeholder.png"
                                        }
                                        alt="Avatar"
                                    />
                                    <CldUploadButton
                                        options={{ maxFiles: 1 }}
                                        onSuccess={handleUpload}
                                        uploadPreset="beanmaomao"
                                        className="flex justify-center rounded-md px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 bg-sky-100 hover:bg-sky-200 text-sky-600"
                                    >
                                        Change
                                    </CldUploadButton>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="
                        mt-6
                        flex
                        items-center
                        justify-center
                        gap-x-6"
                    >
                        <Button
                            disabled={isLoading}
                            secondary
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button disabled={isLoading} type="submit">
                            Save
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default SettingsModal;
