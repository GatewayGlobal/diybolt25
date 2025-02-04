import { TextInput, Button, Stack, Paper, Title, Alert, Box, LoadingOverlay } from '@mantine/core'
import { useForm } from '@mantine/form'
import { Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth/AuthContext'
import { useState } from 'react'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, user } = useAuth()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // If user is already logged in, redirect to home
  if (user) {
    return <Navigate to="/" replace />
  }

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => !/^\S+@\S+$/.test(value) && 'Invalid email',
      password: (value) => !value && 'Password is required',
    },
  })

  const handleSubmit = async (values) => {
    try {
      setError(null)
      setLoading(true)
      
      const { error } = await signIn({
        email: values.email,
        password: values.password,
      })
      
      if (error) throw error
      
      // Navigate to the page they tried to visit or home
      // Always redirect to dashboard after login
      navigate("/", { replace: true })
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <Box 
      style={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(to right, #e9ecef, #f8f9fa)',
        padding: '1rem'
      }}
    >
      <Title 
        order={1} 
        mb="lg" 
        fw={900} 
        ta="center" 
        style={{ fontSize: 'clamp(1.75rem, 5vw, 2.25rem)' }}
      >
        Gateway Fleet System
      </Title>
      
      <Box style={{ 
        width: '100%', 
        maxWidth: '420px',
        margin: 0,
        position: 'relative'
      }}>
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
        <Paper 
          withBorder 
          shadow="md" 
          p={{ base: 20, sm: 30 }} 
          radius="md" 
          bg="white"
        >
          <Title 
            order={2} 
            ta="center" 
            mb="md" 
            fw={700}
            style={{ fontSize: 'clamp(1.5rem, 4vw, 1.75rem)' }}
          >
            Welcome Back
          </Title>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              {error && (
                <Alert color="red" title="Error" variant="light">
                  {error}
                </Alert>
              )}
              
              <TextInput
                label="Email"
                placeholder="your@email.com"
                size="md"
                required
                disabled={loading}
                {...form.getInputProps('email')}
              />

              <TextInput
                label="Password"
                type="password"
                size="md"
                required
                disabled={loading}
                {...form.getInputProps('password')}
              />

              <Button type="submit" size="md" fullWidth loading={loading}>
                Sign in
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Box>
  )
}
