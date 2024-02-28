import React, { useMemo } from "react";
import {
    Button,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton,
    useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import isEmpty from 'lodash/isEmpty';

import SelectController from "components/Form/SelectController";
import { RemoveWebsiteOptions } from "constants/common";
import { mappingOptionsFromArrString } from "utils/mapping";
import { useCreateDirectLinkMutation, useUpdateDirectLinkMutation } from "services/website";
import InputController from "components/Form/InputController";

const getArrStringFromArrSelected = (arrSelected) => {
    if (arrSelected.length === 0) return []
    return arrSelected.map(item => item.value)
}

const CreateDirectLink = ({ isOpen, editDirectLinkDetail, onClose, categories, refetch }) => {
    const cancelRef = React.useRef();
    const toast = useToast();
    const createDirectLink = useCreateDirectLinkMutation()
    const updateDirectLink = useUpdateDirectLinkMutation()

    const categoryEdit = useMemo(() => {
        return categories.find(item => item.value === editDirectLinkDetail?.category);
    }, [categories, editDirectLinkDetail?.category]);

    const schema = yup.object().shape({
        name: yup.string(),
        removeCampaignWith: yup.array().of(yup.object().shape({
            label: yup.string().required(),
            value: yup.string().required()
        })).min(1, 'Vui lòng chọn kiểu loại bỏ'),
        category: yup.object().nullable().required("Vui lòng chọn loại"),
    });
    const { control, handleSubmit } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: editDirectLinkDetail?.name || "",
            removeCampaignWith: editDirectLinkDetail?.removeCampaignWith.length > 0 ? mappingOptionsFromArrString(editDirectLinkDetail?.removeCampaignWith) : undefined,
            category: categoryEdit || undefined,
        },
    });

    const onSubmit = (values) => {
        if (!isEmpty(editDirectLinkDetail)) {
            updateDirectLink.mutate(
                { name: values?.name, category: values?.category?.value, removeCampaignWith: getArrStringFromArrSelected(values?.removeCampaignWith), directLinkId: editDirectLinkDetail?._id },
                {
                    onSuccess: () => {
                        toast({
                            title: "Đã chỉnh sửa thành công.",
                            status: "success",
                            duration: 9000,
                            isClosable: true,
                        });
                        refetch()
                        onClose()
                    },
                }
            );
        } else {
            createDirectLink.mutate(
                { category: values?.category?.value, removeCampaignWith: getArrStringFromArrSelected(values?.removeCampaignWith) },
                {
                    onSuccess: () => {
                        toast({
                            title: "Đã tạo thành công.",
                            status: "success",
                            duration: 9000,
                            isClosable: true,
                        });
                        refetch()
                        onClose()
                    },
                }
            );
        }
    };

    return (
        <>
            <AlertDialog
                motionPreset="slideInBottom"
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isOpen={isOpen}
                isCentered
            >
                <AlertDialogOverlay />

                <AlertDialogContent>
                    <AlertDialogHeader textTransform="uppercase">
                        {!isEmpty(editDirectLinkDetail) ? "Cập nhật Direct Link" : "Tạo Direct Link"}
                    </AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        <form>
                            {
                                !isEmpty(editDirectLinkDetail) &&
                                <InputController
                                    control={control}
                                    name="name"
                                    label="Tên"
                                />
                            }
                            <SelectController
                                isMulti
                                styleContainer={{ pt: "4" }}
                                control={control}
                                name="removeCampaignWith"
                                label="Kiểu loại bỏ"
                                placeholder="Chọn"
                                isRequired
                                options={RemoveWebsiteOptions}
                            />
                            <SelectController
                                isDisabled={!isEmpty(editDirectLinkDetail)}
                                styleContainer={{ pt: "4" }}
                                control={control}
                                name="category"
                                label="Danh mục"
                                isRequired
                                options={categories}
                            />
                        </form>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                            Hủy
                        </Button>
                        <Button colorScheme="red" ml={3} onClick={handleSubmit(onSubmit)}>
                            Tạo
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default CreateDirectLink;
