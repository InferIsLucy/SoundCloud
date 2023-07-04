import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 15,
  },
  containerReply: {
    marginLeft: 50,
  },
  body: {
    marginHorizontal: 10,
  },
  commentInfor: {
    flexDirection: "row",
  },
  userName: {
    fontWeight: "bold",
  },
  commentRecordedTime: {
    marginHorizontal: 5,
  },
  time: {
    color: "#898989",
  },
  moreOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  reply: {
    marginRight: 25,
  },
  replyText: {
    color: "#898989",
    fontWeight: "bold",
  },
});

export default styles;
