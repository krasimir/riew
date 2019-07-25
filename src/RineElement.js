export default function createRineElement(Component) {
  return {
    in(props) {
      return Component(props);
    },
    out() {

    }
  };
}
