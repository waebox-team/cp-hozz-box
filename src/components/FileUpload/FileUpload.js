import { useRef } from 'react'
import { InputGroup } from '@chakra-ui/react'

const FileUpload = (props) => {
    const { register, accept, multiple, children } = props
    const inputRef = useRef(null)
    const { ref, ...rest } = register

    const handleClick = () => inputRef.current?.click()

    return (
        <InputGroup onClick={handleClick}>
            <input
                type={'file'}
                multiple={multiple || false}
                hidden
                accept={accept}
                {...rest}
                ref={(e) => {
                    ref(e)
                    inputRef.current = e
                }}
            />
            <>
                {children}
            </>
        </InputGroup>
    )
}

export default FileUpload