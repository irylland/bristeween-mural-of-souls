import { describe, expect, it } from "vitest";
import { canAccessCommunity } from "@/lib/registration-access";

describe("Registration approval", () => {
  it("blocks a pending registration", () => {
    expect(canAccessCommunity("pending", false)).toBe(false);
  });
  it("allows a registration approved by the administrator", () => {
    expect(canAccessCommunity("approved", false)).toBe(true);
  });
  it("does not grant access when approval could not be read", () => {
    expect(canAccessCommunity(undefined, false)).toBe(false);
  });
  it("preserves organizer access", () => {
    expect(canAccessCommunity("pending", true)).toBe(true);
  });
});