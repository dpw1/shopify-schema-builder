import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import ReactDOM from "react-dom";

let renderCount = 0;

export default function BeautifulDND() {
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      test: [{ firstName: "" }, { firstName: "" }],
    },
  });

  const { fields, append, move, remove } = useFieldArray({
    control,
    name: "test",
  });

  const handleDrag = ({ source, destination }) => {
    if (destination) {
      move(source.index, destination.index);
    }
  };
  const onSubmit = (data) => console.log("data", data);

  renderCount++;
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Drag and Drop Field Array </h1>

        <DragDropContext onDragEnd={handleDrag}>
          <ul>
            <Droppable droppableId="test-items">
              {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {fields.map((item, index) => {
                    // console.log(item);
                    return (
                      <Draggable
                        key={`test[${index}]`}
                        draggableId={`item-${index}`}
                        index={index}>
                        {(provided, snapshot) => (
                          <li
                            key={item.id}
                            ref={provided.innerRef}
                            {...provided.draggableProps}>
                            <input
                              name={`test[${index}].firstName`}
                              defaultValue={`${item.firstName}`} // make sure to set up defaultValue
                              ref={register()}
                            />
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                background: "skyblue",
                              }}
                              {...provided.dragHandleProps}>
                              Drag Me
                            </div>
                          </li>
                        )}
                      </Draggable>
                    );
                  })}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </ul>
        </DragDropContext>

        <section>
          <button
            type="button"
            onClick={() => {
              append({ firstName: "" });
            }}>
            Append
          </button>

          <button
            type="button"
            onClick={() => {
              move(0, 1);
            }}>
            Move
          </button>

          <button
            type="button"
            onClick={() => {
              remove(0);
            }}>
            Remove
          </button>
        </section>

        <input type="submit" />
      </form>
    </div>
  );
}
