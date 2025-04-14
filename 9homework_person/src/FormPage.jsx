import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string().required("Обязательное поле"),
  age: Yup.number()
    .required("Обязательное поле")
    .positive("Возраст должен быть положительным числом")
    .integer("Возраст должен быть целым числом"),
  email: Yup.string()
    .email("Некорректный email")
    .required("Обязательное поле"),
  pet: Yup.array()
    .of(
      Yup.object({
        name: Yup.string().required("Имя питомца обязательно"),
        age: Yup.number()
          .required("Возраст питомца обязателен")
          .positive("Возраст должен быть положительным числом")
          .integer("Возраст должен быть целым числом"),
      })
    )
    .min(1, "Должен быть хотя бы один питомец"),
});

const initialValues = {
  name: "",
  age: "",
  email: "",
  pet: [{ name: "", age: "" }],
};

const FormPage = ({ onFormSubmit }) => {
  const handleSubmit = (values, { resetForm }) => {
    onFormSubmit(values);
    resetForm();
  };

  return (
    <div>
      <h2>Форма ввода данных</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <div className="name">
              <label htmlFor="name">Имя:</label>
              <Field type="text" id="name" name="name" />
              <ErrorMessage name="name" component="div" style={{ color: "red" }} />
            </div>

            <div className="age">
              <label htmlFor="age">Возраст:</label>
              <Field type="number" id="age" name="age" />
              <ErrorMessage name="age" component="div" style={{ color: "red" }} />
            </div>

            <div className="email">
              <label htmlFor="email">Email:</label>
              <Field type="email" id="email" name="email" />
              <ErrorMessage name="email" component="div" style={{ color: "red" }} />
            </div>

            <div className="pet_form">
              <h3>Питомцы:</h3>
              {values.pet.map((pet, index) => (
                <div className="pet_name" key={index}>
                  <label htmlFor={`pet[${index}].name`}>Имя питомца:</label>
                  <Field type="text" id={`pet[${index}].name`} name={`pet[${index}].name`} />
                  <ErrorMessage
                    name={`pet[${index}].name`}
                    component="div"
                    style={{ color: "red" }}
                  />
                <div>
                  <label className="pet_age" htmlFor={`pet[${index}].age`}>Возраст питомца:</label>
                  <Field type="number" id={`pet[${index}].age`} name={`pet[${index}].age`} />
                  <ErrorMessage
                    name={`pet[${index}].age`}
                    component="div"
                    style={{ color: "red" }}
                  /></div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setFieldValue("pet", [...values.pet, { name: "", age: "" }])}
              >
                Добавить питомца
              </button>
            </div>

            <button style={{marginLeft: 20}}type="submit">Отправить</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FormPage;