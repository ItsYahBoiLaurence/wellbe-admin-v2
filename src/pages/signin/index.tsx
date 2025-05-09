import { BackgroundImage, Box, Button, Center, Image, Paper, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core"
import BGImage from '../../assets/wellbe.png'
import Logo from '../../assets/logo.svg'
import { useForm } from "react-hook-form"
import { useMutation } from "react-query"
import { useContext } from "react"
import { AuthenticationContext } from "../../context/Authencation"
import { useNavigate } from "react-router-dom"

type Creds = {
  email: string,
  password: string
}

const signin = () => {
  const navigate = useNavigate()
  const { login } = useContext(AuthenticationContext)
  const {
    register,
    handleSubmit,
    formState: { errors, },
    setError,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });


  const onSubmit = async (data) => {
    const { email, password } = data
    try {
      await login(email, password)
    } catch (error) {
      throw error
    }
  };

  return (
    <Center bg='white' h='100vh' p='md'>
      <Paper radius='sm' h='460' >
        <BackgroundImage
          src={BGImage}
          w={600}
          h={500}
        >
          <Image src={Logo} w={180} />
        </BackgroundImage>
      </Paper>
      <Paper radius='md' px='xl' py='xl' bg='#A7b7e6' w='400' h='500' >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack justify="space-between" h='400'>
            <Box>
              <Box mb='md'>
                <Title c='white' order={1}>Welcome!</Title>
                <Text c='white' size="lg">Log in to your account</Text>
              </Box>
              <Stack>
                <TextInput
                  {...register('email', { required: 'Email is required' })}
                  label={<Text c='white'>Email</Text>}
                  placeholder="sample@email.com"
                  error={errors.email?.message}
                />
                <PasswordInput
                  {...register('password', { required: 'Password is required' })}
                  label={<Text c='white'>Password</Text>}
                  placeholder="Password"
                  error={errors.password?.message}
                />
              </Stack>
            </Box>
            <Button variant="filled" color="#515977" type="submit" >Login</Button>
          </Stack>
        </form>
      </Paper>
    </Center >
  )
}
export default signin