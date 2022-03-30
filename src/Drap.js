import React, { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import cn from "classnames";
import styles from "./App.module.css";
const pipeline = {
  name: "First Pipeline",
  stages: [
    {
      name: "One",
      amount: "250,000,000",
      deals: [
        {
          title: "Dangote Cements",
          amount: "125,000,000",
        },
        {
          title: "Ibeto Cements",
          amount: "125,000,000",
        },
      ],
    },
    {
      name: "Two",
      amount: "0",
      deals: [],
    },
    {
      name: "Three",
      amount: "0",
      deals: [],
    },
  ],
};
export default function Drap() {
  const [currentPipeline, setCurrrentPipeline] = useState(pipeline);
  const [hoverInd, setHoverInd] = useState(-1);
  const [saveInd, setSaveInd] = useState(-1);

  const changeDealLocation = (deal, from, toStageInd) => {
    setCurrrentPipeline((prev) => {
      const nextPipeline = JSON.parse(JSON.stringify(prev));
      const currentStages = [...nextPipeline.stages];
      const fromStage = { ...currentStages[from.stageInd] };

      const toStage = { ...currentStages[toStageInd] };
      console.log(toStage);
      fromStage.deals.splice(from.dealInd, 1);
      toStage.deals.push(deal);

      currentStages[from.stageInd] = fromStage;
      currentStages[toStageInd] = toStage;
      nextPipeline.stage = currentStages;
      return nextPipeline;
    });
  };

  return (
    <div className={styles.container}>
      <p>{currentPipeline.name}</p>
      <div className={styles.pipeline}>
        {currentPipeline.stages.map((stage, stageInd) => {
          return (
            <div key={stage.name}>
              <Stage stage={stage} />
              <DealWrapper
                stageInd={stageInd}
                changeDealLocation={changeDealLocation}
                setOnHover={setHoverInd}
                hovered= {stageInd == hoverInd}
                saving= {stageInd == saveInd}
                setOnsave={setSaveInd}
              >
                {stage.deals.map((deal, dealInd) => {
                  return (
                    <Deal
                      deal={deal}
                      key={deal.title}
                      stageInd={stageInd}
                      dealInd={dealInd}
                    />
                  );
                })}
              </DealWrapper>
            </div>
          );
        })}
      </div>
    </div>
  );
}
const DealWrapper = ({
  stageInd: toStageInd,
  children,
  changeDealLocation,
  setOnHover,
  hovered,
  setOnsave,
  saving
}) => {
  const handleSave = () => {
    setOnsave(toStageInd);
    setTimeout(() => {
      setOnsave(-1);
    }, 3000)
  }
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: "DealItem",
    drop: (item) => {
      let { deal, dealInd, stageInd } = item;
      let from = { dealInd, stageInd };
      console.log(deal, from, toStageInd);
      setOnHover?.(-1)
      changeDealLocation(deal, from, toStageInd);
      handleSave()
    },
    hover:(item,monitor) => {
      setOnHover?.(toStageInd)
      return{
        isOver: !!monitor.isOver()
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver,
      
    }),
  }));
  return (
    <div className={cn([styles.dealWrapper,{[styles.hovered]:hovered, [styles.loading]: saving}])} ref={dropRef}>
      {children}
    </div>
  );
};
const Deal = ({ deal, stageInd, dealInd, onClick }) => {
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: "DealItem",
      item: {
        deal,
        stageInd,
        dealInd,
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [dealInd, stageInd]
  );
  return (
    <div
      className={cn([styles.deal, { [styles.isDragging]: isDragging }])}
      ref={dragRef}
    >
      <h4>{deal?.title}</h4>
      <p>{deal?.amount}</p>
    </div>
  );
};
const Stage = ({ stage }) => {
  return (
    <div className={styles.stage}>
      <h3>{stage.name}</h3>
      <p>{stage.amount}</p>
    </div>
  );
};
