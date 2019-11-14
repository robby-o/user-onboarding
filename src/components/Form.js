import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

function MyForm() {
  const [users, setUsers] = useState([
    {
      id: "",
      name: "",
      email: "",
      password: ""
    }
  ]);

  const handleSubmit = (values, tools) => {
    if (users.some(user => user.email === values.email)) {
      tools.setErrors({ email: "That email is already taken" });
    } else {
      console.log(users);
      axios
        .post("https://reqres.in/api/users", values)
        .then(res => {
          setUsers([...users, createNewUser(res.data)]);
          tools.resetForm();
        })
        .catch(err => {
          console.log(err);
        });
    }
  };
  const createNewUser = res => {
    const newUser = {
      id: res.id,
      name: res.name,
      email: res.email,
      password: res.password
    };
    return newUser;
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Too short!")
      .required("Name is Required"),
    email: Yup.string()
      .email("Invalid email")
      .required("Email is Required"),
    password: Yup.string()
      .min(6, "Password must be 6 characters or longer")
      .required("Password is Required"),
    tos: Yup.boolean().test(
      "is-true",
      "Must agree to terms of service",
      value => value === true
    )
  });
  return (
    <>
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          tos: false
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched }) => (
          <Form>
            <div>
              <Field type="text" name="name" placeholder="Name" />
              {touched.name && errors.name && <ErrorMessage name="name" />}
            </div>

            <div>
              <Field type="email" name="email" placeholder="Email" />
              {touched.email && errors.email && <ErrorMessage name="email" />}
            </div>

            <div>
              <Field type="password" name="password" placeholder="Password" />
              {touched.password && errors.password && (
                <ErrorMessage name="password" />
              )}
            </div>

            <label>
              <Field type="checkbox" name="tos" checked={values.tos} />
              Accept TOS
              {errors.password && <ErrorMessage name="tos" />}
            </label>

            <div>
              <button type="submit">Submit!</button>
            </div>
          </Form>
        )}
      </Formik>
      {users.map(user => (
        <ul key={user.id}>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </ul>
      ))}
    </>
  );
}

export default MyForm;
