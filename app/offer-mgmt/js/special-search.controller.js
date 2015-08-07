// Visual Studio Code Typings and autocompletion
/// <reference path="../../../typings/angularjs/angular.d.ts"/>

angular.module('app.offer-mgmt')
    .controller('SpecialSearchCntl', function ($scope, $modal, globalSpinner, paginatedSpecialList, offers, appContext) {
	'use strict';

	appContext.getCurrentUser().then(function (currentUser) {
		$scope.currentUser = currentUser;
	});

	var selectedSpecial = function () {
		return $scope.selectedItems && $scope.selectedItems.length ? $scope.selectedItems[0] : undefined;
	};

	$scope.openEditDialog = function (specialRow) {
		$modal.open({
			templateUrl: 'offer-mgmt/html/special-details.html',
			controller: 'SpecialDetailsCntl',
			resolve: {
				specialDetails: function () {
					if (specialRow) {
						var loadedSpecial = offers.loadSpecial(specialRow.id);
						return loadedSpecial;
					} else {
						// create
						return {
							"name": null,
							"offerId": null,
							"specialPrice": null,
							"activePeriod": {
								startingDay : null,
								startingHour : null,
								endingDay : null,
								endingHour : null
							}
						}
					}
				},
				allOffers: function () {
					return offers
						.loadAllOffers()
						.then(
						function (response) {
							//console.log("All Offers: " + JSON.stringify(response));
							return response;
						}
						);
				},
			}
		}).result.finally(function () {
            $scope.reloadSpecials();
        });
	};

	$scope.selectedItems = [];
	$scope.maxSize = 5;
	$scope.totalItems = paginatedSpecialList.pagination.total;
	$scope.numPerPage = paginatedSpecialList.pagination.size;
	$scope.currentPage = paginatedSpecialList.pagination.page;


	$scope.gridOptions = {
		data: paginatedSpecialList.result
	};


	$scope.reloadSpecials = function () {
		offers.getPaginatedSpecials($scope.currentPage, $scope.numPerPage).then(function (paginatedSpecials) {
			return paginatedSpecials;
		}).then(function (res) {
			paginatedSpecialList = res;
			$scope.gridOptions.data = paginatedSpecialList.result;
		});
	};

	$scope.$watch('currentPage', function () {
		$scope.reloadSpecials();
	});

	$scope.buttonDefs = [
		{
			label: 'Edit Special',
			onClick: function () {
				$scope.openEditDialog(selectedSpecial());
			},
			isActive: function () {
				return selectedSpecial();
			}
		},
		{
			label: 'Create New Special',
			onClick: function () {
				$scope.openEditDialog();
			},
			isActive: function () {
				return true;
			}
		},
		{
			label: 'Delete Special',
			onClick: function () {
				offers.deleteSpecial(selectedSpecial().id).then(function () {
                    $scope.reloadSpecials();
                });
			},
			isActive: function () {
				return selectedSpecial();
			}
		},
	];


});