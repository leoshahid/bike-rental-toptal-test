import { FC } from "react";
import { styled } from "@mui/system";

export interface IAttributeProps {
  className?: string;
  children: any;
}

const StyledDiv = styled("div")(({ theme }) => ({
  display: "flex",
  padding: "4px 0px",
  flexDirection: theme.breakpoints.down("sm") ? "column" : "row",
}));

export const Attribute: FC<IAttributeProps> = (props) => {
  return <StyledDiv>{props.children}</StyledDiv>;
};

export * from "./AttributeLabel";
export * from "./AttributeValue";
