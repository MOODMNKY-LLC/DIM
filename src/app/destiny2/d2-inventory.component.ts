import template from './d2-inventory.html';
import { subscribeOnScope } from '../rx-utils';
import { getBuckets } from './d2-buckets.service';
import { IComponentOptions, IScope, IController } from 'angular';
import { DestinyAccount } from '../accounts/destiny-account.service';
import { StoreServiceType } from '../inventory/store-types';

export const D2InventoryComponent: IComponentOptions = {
  template,
  bindings: {
    account: '<'
  },
  controller: D2InventoryController
};

function D2InventoryController(
  this: IController & {
    account: DestinyAccount;
  },
  $scope: IScope,
  D2StoresService: StoreServiceType
) {
  'ngInject';

  const vm = this;

  this.$onInit = () => {
    getBuckets().then((buckets) => {
      vm.buckets = buckets;
      subscribeOnScope($scope, D2StoresService.getStoresStream(vm.account), (stores) => {
        if (stores) {
          vm.stores = stores;
        }
      });
    });
  };

  $scope.$on('dim-refresh', () => {
    D2StoresService.reloadStores();
  });
}
