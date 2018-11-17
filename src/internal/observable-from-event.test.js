import ObservableFromEvent from './observable-from-event';

test('adds event listener on subscription', () => {
  const { eventTarget: target } = fakeEventTarget();
  const type = 'foo';
  const options = {};

  const observable = ObservableFromEvent({ target, type, options });
  observable.subscribe();

  expect(target.addEventListener).toHaveBeenCalledTimes(1);
  expect(target.addEventListener).toHaveBeenCalledWith(
    type,
    expect.any(Function),
    options
  );
});

test('removes listener when unsubscribed', () => {
  const { eventTarget: target, addEventListenerSpy } = fakeEventTarget();
  const type = 'foo';
  const options = {};

  const observable = ObservableFromEvent({ target, type, options });
  observable.subscribe().unsubscribe();

  const listener = addEventListenerSpy.mock.calls[0][1];
  expect(target.removeEventListener).toHaveBeenCalledTimes(1);
  expect(target.removeEventListener).toHaveBeenCalledWith(
    type,
    listener,
    options
  );
});

test('emits matching events', () => {
  const { eventTarget: target } = fakeEventTarget();
  const type = 'foo';

  const observable = ObservableFromEvent({ target, type });
  const observer = jest.fn();
  observable.subscribe(observer);

  const events = [
    matchingEvent(),
    notMatchingEvent(),
    notMatchingEvent(),
    matchingEvent(),
    notMatchingEvent(),
    matchingEvent(),
    matchingEvent(),
  ];
  events.forEach((event) => {
    target.dispatchEvent(event);
  });

  expect(observer).toHaveBeenCalledTimes(4);
  expect(observer).toHaveBeenNthCalledWith(1, events[0]);
  expect(observer).toHaveBeenNthCalledWith(2, events[3]);
  expect(observer).toHaveBeenNthCalledWith(3, events[5]);
  expect(observer).toHaveBeenNthCalledWith(4, events[6]);

  function matchingEvent() {
    return new Event(type);
  }

  function notMatchingEvent() {
    return new Event('not' + type);
  }
});

function fakeEventTarget() {
  const eventTarget = document.createElement('div');
  const addEventListenerSpy = jest.spyOn(eventTarget, 'addEventListener');
  const removeEventListenerSpy = jest.spyOn(eventTarget, 'removeEventListener');
  return { eventTarget, addEventListenerSpy, removeEventListenerSpy };
}
