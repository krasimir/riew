/* eslint-disable max-len */

const cleanHTML = html => html.toString().trim().replace(new RegExp('\\n', 'gi'), '').replace(new RegExp(' {2}', 'g'), '');

export const delay = (time = 5) => new Promise(done => setTimeout(done, time));
export const exerciseHTML = (container, expectation) => {
  expect(cleanHTML(container.innerHTML)).toEqual(cleanHTML(expectation));
};
