import { makeAutoObservable } from "mobx";

class LoadingStore {
  activeRequests = 0;

  constructor() {
    makeAutoObservable(this);
  }

  startLoading = () => {
    this.activeRequests++;
  };

  stopLoading = () => {
    this.activeRequests = Math.max(this.activeRequests - 1, 0);
  };

  get isLoading() {
    return this.activeRequests > 0;
  }
}

export const loadingStore = new LoadingStore();
