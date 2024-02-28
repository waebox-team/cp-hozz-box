import React, { useState } from "react";
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
    RadioGroup,
    Radio,
    Text,
} from "@chakra-ui/react";
import { useCreateAddAdUnitMutation, useQueryGetMyWebsiteAdUnits } from "services/website";
import { AdUnitsOptions } from "constants/common";
import { isObjectNameInArray } from "utils/helpers";

const AddAdUnit = ({ isOpen, editWebsiteDetail, onClose, refetch }) => {
    const cancelRef = React.useRef();
    const toast = useToast();
    const createAddAdUnit = useCreateAddAdUnitMutation();
    const [valueChecked, setValueChecked] = useState("")

    const {
        data,
    } = useQueryGetMyWebsiteAdUnits(editWebsiteDetail?._id, {
        pageSize: 10,
        pageIndex: 0,
    });

    const onSubmit = () => {
        if (valueChecked) {
            createAddAdUnit.mutate(
                {
                    websiteId: editWebsiteDetail?._id,
                    adUnit: valueChecked
                },
                {
                    onSuccess: () => {
                        toast({
                            title: "Đã thêm thành công.",
                            status: "success",
                            duration: 9000,
                            isClosable: true,
                        });
                        setValueChecked("")
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
                <AlertDialogContent padding={3}>
                    <AlertDialogHeader textTransform="uppercase">
                        Thêm mã mới
                    </AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        <Text mb={4} fontWeight={"600"} fontSize={16}>Đơn vị quảng cáo có sẵn</Text>
                        <RadioGroup>
                            {
                                AdUnitsOptions.map((option, index) => (
                                    <Radio size='lg' key={index} onChange={(e) => {
                                        if (isObjectNameInArray(option.value, data?.data, "adUnit")) {
                                            setValueChecked("")
                                            return
                                        };
                                        setValueChecked(e.target.value)
                                    }} disabled={isObjectNameInArray(option.value, data?.data, "adUnit")} value={option.value} w={"50%"} py={2}>
                                        {option.label}
                                    </Radio>
                                ))
                            }
                        </RadioGroup>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                            Hủy
                        </Button>
                        <Button colorScheme="blue" ml={3} onClick={onSubmit}>
                            Thêm
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default AddAdUnit;
