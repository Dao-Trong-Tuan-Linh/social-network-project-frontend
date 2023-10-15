"use client";
import React from "react";
import { Box, Typography, Grid, TextField, Button } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { setToken, setUser,getToken } from "@/app/utils/localstorage";
import { useRouter } from "next/navigation";

const emailRegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const schema = yup.object({
  username: yup.string().required(),
  email: yup.string().matches(emailRegExp, "Invalid Email").required(),
  password: yup.string().required(),
  confirmPassword: yup.string().required(),
});

type FormRegister = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Register() {
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<FormRegister>({
    resolver: yupResolver(schema),
  });

  const token = getToken()
  const router = useRouter()
  if(token) {
    router.push('/')
  }
  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(proxy, result) {
      console.log(result);
      setToken(result.data.register.token)
      setUser(result.data.register.username)
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
      username: getValues("username"),
      email: getValues("email"),
      password: getValues("password"),
      confirmPassword: getValues("confirmPassword"),
    },
  });
  const onSubmit: SubmitHandler<FormRegister> = (data) => {
    console.log("username:",getValues("username"))
    addUser();
  };
 
  return (
    <Box
      sx={{
        backgroundColor: "#f0f2f5",
        minHeight: "600px",
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
          spacing={2}
        >
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography sx={{ fontSize: "32px", fontWeight: "600" }}>
              Register
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Username"
              {...register("username")}
              error={errors.username ? true : false}
              helperText={errors.username?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              {...register("email")}
              error={errors.email ? true : false}
              helperText={errors.email?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              {...register("password")}
              error={errors.password ? true : false}
              helperText={errors.password?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="ConfirmPassword"
              type="password"
              {...register("confirmPassword")}
              error={errors.confirmPassword ? true : false}
              helperText={errors.confirmPassword?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              sx={{ width: "100%" }}
              size="large"
              variant="contained"
              type="submit"
              disabled={
                errors.username ??
                errors.email ??
                errors.password ??
                errors.confirmPassword
                  ? true
                  : false
              }
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

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      email
      username
      token
    }
  }
`;
