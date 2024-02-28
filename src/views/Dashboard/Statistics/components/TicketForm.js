import React from "react";
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
import { yupResolver } from "@hookform/resolvers/yup";
import isEmpty from 'lodash/isEmpty';

import InputController from "components/Form/InputController";
import SelectController from "components/Form/SelectController";
import { TypeTicket } from "constants/common";
import { useCreateTicketMutation } from "services/support";
import { TicketFormValidate } from "utils/validation";

const TicketForm = ({ isOpen, editTicketDetail, onClose, refetch }) => {
    const cancelRef = React.useRef();
    const toast = useToast();
    const createTicket = useCreateTicketMutation()

    const { control, handleSubmit } = useForm({
        resolver: yupResolver(TicketFormValidate),
        defaultValues: {
            subject: editTicketDetail?.subject || "",
            content: editTicketDetail?.content || "",
            type: TypeTicket.find(item => item.value === editTicketDetail?.type) || undefined,
        },
    });

    const onSubmit = (values) => {
        createTicket.mutate(
            { ...values, type: values?.type?.value },
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
                        {isEmpty(editTicketDetail) ? "Tạo thông tin Ticket" : "Thông tin Ticket"}
                    </AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        <form>
                            <SelectController
                                control={control}
                                name="type"
                                label="Loại"
                                placeholder="Chọn"
                                isRequired
                                options={TypeTicket}
                            />
                            <InputController
                                styleContainer={{ pt: "4" }}
                                control={control}
                                name="subject"
                                label="Chủ đề"
                                isRequired
                            />
                            <InputController
                                type="textarea"
                                styleContainer={{ pt: "4" }}
                                control={control}
                                name="content"
                                label="Nội dung"
                                isRequired
                            />
                        </form>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                            Hủy
                        </Button>
                        {isEmpty(editTicketDetail) &&
                            <Button colorScheme="red" ml={3} onClick={handleSubmit(onSubmit)}>
                                Tạo
                            </Button>}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default TicketForm;
