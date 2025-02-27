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
  const { user, login } = useContext(AuthenticationContext)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutateAsync: loginUser, isLoading: isLoggingIn } = useMutation({
    mutationFn: async (credentials: Creds) => login(credentials),
    onSuccess: async (data) => {
      navigate('/')
    },
    onError: (error) => {
      // Handle different Firebase error codes
      switch (error.code) {
        case "auth/invalid-email":
          setError("email", {
            type: "manual",
            message: "Invalid email format.",
          });
          break;
        case "auth/user-disabled":
          setError("email", {
            type: "manual",
            message: "This user account has been disabled.",
          });
          break;
        case "auth/user-not-found":
          setError("email", {
            type: "manual",
            message: "No user found with this email.",
          });
          break;
        case "auth/wrong-password":
        case "auth/invalid-credentials":
          // Some Firebase configurations may return "auth/invalid-credentials" instead of "auth/wrong-password"
          setError("password", {
            type: "manual",
            message: "Incorrect password.",
          });
          break;
        default:
          // For any other error, log it and set a generic error
          console.error("Login error:", error);
          setError("email", {
            type: "manual",
            message: "An unexpected error occurred. Please try again.",
          });
      }
    },
  });

  const onSubmit = (data) => {
    loginUser(data);
  };

  return (
    <Center bg='white' h='100vh' p='md'>
      <Paper radius='sm' h='425' >
        <BackgroundImage
          src={BGImage}
          w={600}
          h={425}
        >
          <Image src={Logo} w={180} />
        </BackgroundImage>
      </Paper>
      <Paper radius='md' px='xl' py='xl' bg='#A7b7e6' w='400' h='425' >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack justify="space-between" h='350'>
            <Box>
              <Box mb='md'>
                <Title c='white'>Welcome!</Title>
                <Text c='white'>Log in to your account</Text>
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
            <Button variant="filled" color="#515977" type="submit" disabled={isLoggingIn} loading={isLoggingIn}>Login</Button>
          </Stack>
        </form>
      </Paper>
    </Center >
  )
}
export default signin