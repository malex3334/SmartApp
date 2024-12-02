import colors from "./colors";

const constans = {
  container: {
    width: "100%",
    flexGrow: 1,

    marginTop: 32,
    paddingHorizontal: 30,
    // backgroundColor: colors.background,
    // borderRadius: 10,
    shadowColor: "#000",
  },

  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "100%",
    backgroundColor: colors.background,

    // height: "100%",
  },

  sectionTitle: {
    fontSize: 36,
    letterSpacing: 3,
    fontWeight: "500",
    color: colors.textPrimary,
    textAlign: "center",
    marginTop: 20,
  },

  touchableButton: {
    backgroundColor: colors.primary,
  },

  touchableButtonText: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    padding: 10,
  },
};

export default constans;
