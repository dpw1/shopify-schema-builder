import React, { Component } from "react";
import PropTypes from "prop-types";
import { Container, Draggable } from "react-smooth-dnd";
import short from "short-uuid";
import { useStatePersist as useStickyState } from "use-state-persist";

const applyDrag = (arr, dragResult) => {
  const { removedIndex, addedIndex, payload } = dragResult;
  if (removedIndex === null && addedIndex === null) return arr;

  const result = [...arr];
  let itemToAdd = payload;

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0];
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd);
  }

  return result;
};

const generateItems = (count, creator) => {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(creator(i));
  }
  return result;
};

const initialState = [
  {
    id: short.generate(),
    label: "Full Name",
    element: (
      <div className="field-group">
        <input type="text" />
        <input type="text" />
      </div>
    ),
  },
  {
    id: short.generate(),
    label: "Email",
    element: <input type="email" />,
  },
  {
    id: short.generate(),
    label: "Address",
    element: <textarea name="address" id="" cols="30" rows="10" />,
  },

  {
    id: 7,
    element: (
      <div>
        <button className="form-submit-button">Submit</button>
      </div>
    ),
  },
];

export default function Form() {
  const [form, setForm] = useStickyState("@customform", initialState);

  const handleAdd = () => {
    // setForm([...form, {}]);
  };

  function onDrop(dropResult) {
    return setForm(applyDrag(form, dropResult));

    // return this.setState({ form: applyDrag(this.state.form, dropResult) });
  }

  function generateForm(form) {
    return form.map((item) => {
      return (
        <Draggable key={item.id}>
          <div className={`form-line`}>
            <div className="label">
              <span>{item.label}</span>
            </div>
            <div className="field">{item.element}</div>
          </div>
        </Draggable>
      );
    });
  }

  return (
    <div>
      <div className="form-demo">
        <div className="form">
          <Container
            style={{ paddingBottom: "200px" }}
            dragClass="form-ghost"
            dropClass="form-ghost-drop"
            onDrop={onDrop}
            nonDragAreaSelector=".field">
            {generateForm(form)}
          </Container>
          <button onClick={handleAdd}>Add</button>
        </div>
      </div>
    </div>
  );
}
