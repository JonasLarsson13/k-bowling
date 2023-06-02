import { format } from "date-fns";

export const emailValidation = (email) => {
  if (!email) return false;
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) return false;
  return true;
};

export const checkIfBowlingHallIsOpen = (startTime) => {
  const selectedHour = format(new Date(startTime), "HH");
  if (selectedHour < 10 || selectedHour > 21) return false;
  return true;
};

export const checkIfTimeIsInTheFuture = (startTime) => {
  const currentDateAndTime = format(new Date(), "yyyy-MM-dd HH:mm");
  if (startTime < currentDateAndTime) return false;
  return true;
};

export const checkIfTimeIsFullHour = (startTime) => {
  const selectedMinutes = format(new Date(startTime), "mm");
  if (selectedMinutes !== "00") return false;
  return true;
};

export const checkIfGuestsAndShoesAreEqual = (amountOfGuests, shoeSizes) => {
  if (amountOfGuests !== shoeSizes) return false;
  return true;
};

export const checkIfNumbersAreSame = (numbersArray) => {
  for (let i = 0; i < numbersArray.length; i++) {
    for (let j = i + 1; j < numbersArray.length; j++) {
      if (numbersArray[i] === numbersArray[j]) {
        return false;
      }
    }
  }

  return true;
};
