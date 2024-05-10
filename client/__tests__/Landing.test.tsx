import { render, screen, fireEvent } from "@testing-library/react-native";
import Landing from "../app/index";

test("renders Landing page", async () => {
  render(<Landing />);
  expect(screen.getByTestId("landing-page")).toBeTruthy();
});
