import LabeledInput from "../design/labeled-input/labeled-input";
export default function Session({
  session,
  roles,
  onChangeSession,
  onDeleteSession,
}) {
  function onRoleSelect(e, session) {
    let updatedList = [...session.roles];
    if (e.target.checked) {
      updatedList = [...session.roles, e.target.value];
    } else {
      updatedList.splice(session.roles.indexOf(e.target.value), 1);
    }
    onChangeSession({ ...session, roles: updatedList });
  }

  return (
    <div>
      <div className="p-4 border border-zinc-600 rounded-2xl mb-4 bg-zinc-800">
        <div className="flex flex-row">
          <label className="block text-tock-orange text-sm font-bold mb-2">
            <span className="text-zinc-400">{session.id}: </span> {session.name}
          </label>
          <div className="flex grow justify-end">
            <button
              type="button"
              onClick={() => onDeleteSession(session.id)}
              className="mb-2 mx-2 transition ease-in-out duration-300 text-xs text-zinc-500 text-bold hover:text-tock-red"
            >
              remove session
            </button>
          </div>
        </div>
        <LabeledInput
          value={session.name}
          id={`session_name_${session.id}`}
          type="text"
          placeholder="session name"
          onChange={(e) => onChangeSession({ ...session, name: e.target.value })}
          required={true}
        >
          session name
        </LabeledInput>
        <LabeledInput
          value={session.allocation}
          id={`session_allocation_${session.id}`}
          type="number"
          min="0"
          step="1"
          onChange={(e) =>
            onChangeSession({ ...session, allocation: e.target.value })
          }
          required={true}
        >
          token allocation for{" "}
          <span className="text-tock-orange">{session.name}</span>
        </LabeledInput>
        <LabeledInput
          value={session.start}
          id={`session_start_${session.id}`}
          type="datetime-local"
          onChange={(e) =>
            onChangeSession({ ...session, start: e.target.value })
          }
          required={true}
        >
          start session at
        </LabeledInput>
        <LabeledInput
          value={session.end}
          id={`session_start_${session.id}`}
          type="datetime-local"
          onChange={(e) => onChangeSession({ ...session, end: e.target.value })}
          required={true}
        >
          end session at
        </LabeledInput>
        <div>
          <h1 className="font-bold text-sm text-tock-blue mb-4 ">allowed roles in this session</h1>
          {roles.map((role, i) => {
            return (
              <div className="flex items-center my-2">
                <input
                  id={"sessioon_roles_" + i}
                  type="checkbox"
                  value={role.id}
                  className="w-4 h-4 accent-tock-green text-blue-100"
                  onChange={(e) => onRoleSelect(e, session)}
                />

                <label className="grid font-bold grid-cols-3 ml-2 text-sm border border-zinc-400 rounded-2xl p-2 w-full">
                  <p className="text-tock-orange">{role.name}</p>
                  <p className="text-blue-400">{role.quota} mint/wallet</p>
                  <p className="text-tock-green">{role.price} ETH</p>
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
