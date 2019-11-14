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
      password: "",
      role: ""
    }
  ]);

  const handleSubmit = (values, { setErrors, resetForm, setSubmitting }) => {
    if (users.some(user => user.email === values.email)) {
      setErrors({ email: "That email is already taken" });
    } else {
      axios
        .post("https://reqres.in/api/users", values)
        .then(res => {
          setUsers([...users, createNewUser(res.data)]);
          //   debugger;
          resetForm();
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          setSubmitting(false);
        });
    }
  };

  const createNewUser = res => {
    const newUser = {
      id: res.id,
      name: res.name,
      email: res.email,
      password: res.password,
      role: res.role
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
    ),
    role: Yup.string().required("Please select a role")
  });
  return (
    <>
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          role: "",
          tos: false
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, isSubmitting }) => (
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

            <div>
              <Field as="select" name="role">
                <option value="" disabled>
                  Please choose a role
                </option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="lost">Lost</option>
              </Field>
              {touched.role && errors.role && <ErrorMessage name="role" />}
            </div>

            <label>
              <Field type="checkbox" name="tos" checked={values.tos} />
              Accept TOS
              {errors.tos && <ErrorMessage name="tos" />}
            </label>

            <div>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting" : "Submit"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
      {users.map(user => (
        <ul key={user.id}>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <p>{user.role}</p>
        </ul>
      ))}
    </>
  );
}

export default MyForm;
