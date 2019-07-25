export default function createRoutineController(routine) {
  let mounted = false;
  let pending = [];

  return {
    in(setContent, props) {
      mounted = true;
      return routine({
        ...props,
        render(content) {
          if (mounted) setContent(content);
        },
        take(type) {
          const p = new Promise(done => {
            pending.push({ type, done });
          });

          return p;
        },
        put(typeToResume, payload) {
          pending = pending.filter(({ type, done }) => {
            if (type === typeToResume) {
              done(payload);
              return false;
            }
            return true;
          });
        }
      });
    },
    out() {
      mounted = false;
      pending = [];
    }
  };
}
