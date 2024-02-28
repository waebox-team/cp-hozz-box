import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card, CardBody, CardHeader, Divider, Flex, FormControl, FormLabel, Grid, GridItem, Image, Text, Wrap, useColorMode, useColorModeValue } from "@chakra-ui/react";
import isEmpty from "lodash/isEmpty";
import VTlist from "./VerticalList";
import VTcontent from "./VerticalContent";
import { useUserState } from "context/UserContext";
import InputController from "components/Form/InputController";
import { ROOT_API, TabFeatureProfile } from "constants/common";
import { useUpdateProfileMutation } from "services/user";
import { toast } from "components/Toast";
import { CookieStorage } from "utils/cookie-storage";
import { StorageKeys } from "constants/storage-keys";
import ChangePassword from "./ChangePassword";
import { UpdateProfileFormValidate } from "utils/validation";

function VerticalTab(props) {
    const [activeTabId, setActiveTabId] = useState(TabFeatureProfile.IdentityInfo);
    const [imageFrontSide, setImageFrontSide] = useState(null)
    const [imageBackSide, setImageBackSide] = useState(null)
    const [isUpdate, setIsUpdate] = useState(false)

    const { userInfo } = useUserState();
    const updateProfile = useUpdateProfileMutation()
    const { colorMode } = useColorMode();
    const textColor = useColorModeValue('white', 'white');
    const textTitleColor = useColorModeValue('gray.600', 'white');

    function handleClickButton(id) {
        setActiveTabId(id);
    }

    const { register, control, handleSubmit, setValue } = useForm({
        resolver: yupResolver(UpdateProfileFormValidate),
    })
    const { ...rest } = register

    const onSubmit = values => {
        if (!isEmpty(values) && !isEmpty(imageBackSide) && !isEmpty(imageFrontSide)) {
            updateProfile.mutate({
                ...values,
                frontSideFile: imageFrontSide[0],
                backSideFile: imageBackSide[0]
            }, {
                onSuccess: (res) => {
                    res && CookieStorage.setCookieData(StorageKeys.UserInfo, JSON.stringify(res?.data));
                    toast.showMessageSuccess("Updated profile.");
                    setIsUpdate(true)
                    setValue("fullname", res?.data?.fullname)
                    setValue("codeNumber", res?.data?.codeNumber)
                    setImageBackSide(res?.data?.backIdentificationCard)
                    setImageFrontSide(res?.data?.frontIdentificationCard)
                },
            })
        }
    };

    useEffect(() => {
        setValue("fullname", userInfo?.fullname)
        setValue("codeNumber", userInfo?.codeNumber)
        if (!isEmpty(userInfo?.backIdentificationCard) && !isEmpty(userInfo?.frontIdentificationCard)) {
            userInfo?.backIdentificationCard && setImageBackSide(userInfo?.backIdentificationCard)
            userInfo?.frontIdentificationCard && setImageFrontSide(userInfo?.frontIdentificationCard)
            setIsUpdate(true)
        }
    }, [userInfo])

    return (
        <Wrap w={"100%"}>
            <Grid w={"100%"} gridTemplateColumns={{ base: '1fr', md: '20% 1fr' }} gap={6}>
                <GridItem w='100%'>
                    <Flex bg={"white"} borderRadius={4} padding={"20px"}>
                        <Flex flexDirection={"column"} gap={"10px"}>
                            {props.data.map((item, index) => (
                                <VTlist
                                    key={index}
                                    onClick={handleClickButton}
                                    data={item}
                                    index={index}
                                    activeTabId={activeTabId}
                                />
                            ))}
                        </Flex>
                    </Flex>
                </GridItem>
                <GridItem w='100%'>
                    <VTcontent
                        data={
                            {
                                expData: {
                                    company: "Identity Info",
                                    position: "Graduate Student",
                                    period: "Oct 2018 - present",
                                    details: [
                                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dignissim fringilla dui ac mattis.",
                                        "Donec in sodales eros. Nulla fermentum, ante in venenatis pellentesque, justo odio viverra lorem, varius posuere erat tortor et magna."
                                    ]
                                }
                            }
                        }
                        key={TabFeatureProfile.IdentityInfo}
                        index={TabFeatureProfile.IdentityInfo}
                        activeTabId={activeTabId}
                    >
                        <Card w={"100%"} py="10px">
                            <CardHeader p="6px 20px 10px 20px">
                                <Flex direction="column">
                                    <Text fontSize="larger" color={textTitleColor} fontWeight="bold">
                                        Identity Info
                                    </Text>
                                </Flex>
                            </CardHeader>
                            <Divider color={textColor} />
                            <CardBody>
                                <form>
                                    <InputController
                                        readOnly={isUpdate}
                                        control={control}
                                        name="fullname"
                                        label="Full Name"
                                        isRequired
                                        styleContainer={{ display: 'flex', alignItems: 'start', marginBottom: '15px' }}
                                        styleBoxInput={{ flex: 1 }}
                                        styleLabel={{ marginTop: '10px' }}
                                    />
                                    <InputController
                                        control={control}
                                        readOnly={isUpdate}
                                        type="text"
                                        name="codeNumber"
                                        label="Identification Number"
                                        isRequired
                                        styleContainer={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}
                                        styleBoxInput={{ flex: 1 }}
                                    />
                                    <Flex flexDirection={"column"}>
                                        <FormControl isRequired>
                                            <FormLabel>Identification Card</FormLabel>
                                        </FormControl>
                                        <Flex flexDirection={{ base: "column", md: "row" }}>
                                            <InputController
                                                control={control}
                                                name="frontSideFile"
                                                label={
                                                    <Flex alignItems={"center"} gap={"10px"}>
                                                        <Text fontWeight={"600"}>Front Side</Text>
                                                        {
                                                            !isUpdate &&
                                                            <Text cursor={"pointer"} border={"1px solid #ccc"} textAlign={"center"} padding={"4px"} borderRadius={"10px"}>Upload</Text>
                                                        }
                                                    </Flex>
                                                }
                                                requiredIndicator=""
                                                isRequired
                                                styleContainer={{ display: 'flex', flexDirection: "column", alignItems: 'start', marginBottom: '15px' }}
                                                styleBoxInput={{ flex: 1 }}
                                                type={'file'}
                                                multiple={true}
                                                hidden
                                                onChange={(e) => setImageFrontSide(e.target.files)}
                                                accept={'image/*'}
                                                {...rest}
                                            />
                                            <InputController
                                                control={control}
                                                name="backSideFile"
                                                isRequired
                                                requiredIndicator=""
                                                styleContainer={{ display: 'flex', flexDirection: "column", alignItems: 'start', marginBottom: '15px' }}
                                                styleBoxInput={{ flex: 1 }}
                                                type={'file'}
                                                multiple={true}
                                                hidden
                                                onChange={(e) => setImageBackSide(e.target.files)}
                                                accept={'image/*'}
                                                {...rest}
                                                label={
                                                    <Flex alignItems={"center"} gap={"10px"}>
                                                        <Text fontWeight={"600"}>Back Side</Text>
                                                        {
                                                            !isUpdate &&
                                                            <Text cursor={"pointer"} border={"1px solid #ccc"} textAlign={"center"} padding={"4px"} borderRadius={"10px"}>Upload</Text>
                                                        }
                                                    </Flex>
                                                }
                                            />
                                        </Flex>

                                        <Flex flexDirection={{ base: "column", md: "row" }} gap={"30px"}>
                                            {!isEmpty(imageFrontSide) &&
                                                <Image
                                                    order={0.5}
                                                    w={{ md: "50%", base: "100%" }}
                                                    objectFit={"cover"}
                                                    height={"200px"}
                                                    src={typeof imageFrontSide === "string" ? `${ROOT_API}/${imageFrontSide}` : URL.createObjectURL(imageFrontSide[0])}
                                                    alt="front side"
                                                />
                                            }
                                            {
                                                !isEmpty(imageBackSide) &&
                                                <Image
                                                    order={0.5}
                                                    w={{ md: "50%", base: "100%" }}
                                                    objectFit={"cover"}
                                                    height={"200px"}
                                                    src={typeof imageBackSide === "string" ? `${ROOT_API}/${imageBackSide}` : URL.createObjectURL(imageBackSide[0])}
                                                    alt="back side"
                                                />
                                            }
                                        </Flex>
                                    </Flex>
                                </form>
                                {!isUpdate &&
                                    <Button mt={"30px"} p="0px" bg="transparent" variant="no-effects">
                                        <Flex
                                            align="center"
                                            w={{ sm: '100%', lg: '135px' }}
                                            bg={colorMode === 'dark' ? 'navy.900' : 'blue.500'}
                                            borderRadius="8px"
                                            justifyContent="center"
                                            py="10px"
                                            boxShadow="2px 2px 5.5px rgba(0, 0, 0, 0.06)"
                                            cursor="pointer"
                                            onClick={handleSubmit(onSubmit)}
                                        >
                                            <Text fontSize="small" color={"white"} fontWeight="bold">
                                                Update Info
                                            </Text>
                                        </Flex>
                                    </Button>
                                }
                            </CardBody>
                        </Card>
                    </VTcontent>
                    <VTcontent
                        data={
                            {
                                expData: {
                                    company: "Change Password",
                                    position: "Research Assistant",
                                    period: "Oct 2016 - May 2018",
                                    details: [
                                        "Suspendisse potenti. Vestibulum aliquam luctus sem, at feugiat felis. Pellentesque dignissim lorem eu ipsum condimentum varius. ",
                                        "Nam vehicula pretium arcu. Nam venenatis ante et porta pellentesque."
                                    ]
                                }
                            }
                        }
                        key={TabFeatureProfile.ChangePassword}
                        index={TabFeatureProfile.ChangePassword}
                        activeTabId={activeTabId}
                    ><Card w={"100%"} py="10px">
                            <CardHeader p="6px 20px 10px 20px">
                                <Flex direction="column">
                                    <Text fontSize="larger" color={textTitleColor} fontWeight="bold">
                                    Change Password
                                    </Text>
                                </Flex>
                            </CardHeader>
                            <Divider color={textColor} />
                            <CardBody>
                               <ChangePassword/>
                            </CardBody>
                        </Card></VTcontent>
                </GridItem>
            </Grid>
        </Wrap>
    );
}

export default VerticalTab;
