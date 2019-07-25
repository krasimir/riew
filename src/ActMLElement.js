export default function createActMLElement(Component) {
  return {
    in(props) {
      return Component(props);
    },
    out() {

    }
  };
}
