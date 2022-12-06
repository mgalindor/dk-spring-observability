import { check } from "k6";
import http from "k6/http";
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
  stages: [
    { duration: "30s", target: 1 },
    { duration: "30s", target: 5 },
    { duration: "30s", target: 10 },
    { duration: "30s", target: 20 },
  ],
};

export function prepare() {
  return {
    headers: {
      "Content-Type": "application/json",
    },
    request: {
      personal: {
        firstname: "Mike",
        lastname: "Gal",
        dob: "1989-10-30",
        identityDocument: {
          value: ""+randomIntBetween(10000000, 99999999),
          type: "CURP",
        },
      },
      aliases: [""+randomIntBetween(10000000, 99999999)],
      accounts: [
        { number: "123", type: "bank", exp: "2023-12" },
        {
          number: "456",
          type: "clabe",
          limit: { amount: "10", currency: "USD" },
        },
      ],
      channels: [{ value: "55"+randomIntBetween(10000000, 99999999), type: "PHONE" }],
    },
  };
}

export default function () {
  const data = prepare();

  const url = "http://host.docker.internal:8080/aliases";
  const payload = JSON.stringify(data.request);

  const params = {
    headers: data.headers,
  };

  const res = http.post(url, payload, params);

  check(res, {
    "is status 200": (r) => r.status === 200,
  });
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}