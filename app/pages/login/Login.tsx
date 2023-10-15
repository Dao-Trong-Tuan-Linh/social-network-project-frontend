"use client";
import React,{useState} from "react";
import { Box, Typography, Grid, TextField, Button } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { setToken, setUser,getUser,getToken } from "@/app/utils/localstorage";
import { useRouter } from "next/navigation";

const schema = yup.object({
  username: yup.string().required(),
  password: yup.string().required(),
});

type FormLogin = {
  username: string;
  password: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormLogin>({
    resolver: yupResolver(schema),
  });

  const router = useRouter()
  const token = getToken()
  if(token) {
    router.push('/')
  }
 

  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')

  const [login, { loading }] = useMutation(LOGIN_USER, {
    update(proxy, result) {
      console.log(result);
      setToken(result.data.login.token)
      setUser(result.data.login.username)
      router.push("/")
    },
    onError(err) {
      const stacktrace = err.graphQLErrors[0]?.extensions?.exception?.stacktrace[0] as string
      if(stacktrace) {
        const error = stacktrace.split(":")
        toast.error(error[1])
      }
    },
    variables: {
      username: username,
      password: password,
    },
  });

  

  const onSubmit: SubmitHandler<FormLogin> = (data) => {
    login()
  };
  return (
    <Box
      sx={{
        backgroundColor: "#f0f2f5",
        minHeight:'600px',
        height: "calc(100vh-65px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid
          sx={{
            width: {
              xs: "100%",
              sm: "400px",
              backgroundColor: "#fff",
              padding: "12px 32px 28px 16px",
              borderRadius: "10px",
            },
          }}
          container
          spacing={3}
        >
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography sx={{ fontSize: "32px", fontWeight: "600" }}>
              Login
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Username"
              autoFocus
              {...register("username",{onChange:(e) => setUsername(e.target.value)})}
              error={errors.username ? true : false}
              helperText={errors.username?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              {...register("password",{onChange:(e) => setPassword(e.target.value)})}
              error={errors.password ? true : false}
              helperText={errors.password?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              sx={{ width: "100%" }}
              disabled={errors.username ?? errors.password ? true : false}
              size="large"
              variant="contained"
              type="submit"
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Box>
  );
}

const LOGIN_USER = gql`
  mutation login(
    $username: String!
    $password: String!
  ) {
    login(
      loginInput: {
        username: $username
        password: $password
      }
    ) {
      email
      username
      token
    }
  }
`;
