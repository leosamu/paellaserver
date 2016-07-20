"use strict";
var paella = paella || {};
paella.editor = {};
paella.editor.APP_NAME = "paella-editor";
(function() {
  var app = angular.module(paella.editor.APP_NAME, ['pascalprecht.translate', "ngRoute", 'rzModule', "ui.bootstrap", "ngResource"]);
  app.config(["$translateProvider", function($translateProvider) {
    function loadDictionary(localization) {
      $.ajax('localization/editor_' + localization + '.json').success(function(data) {
        $translateProvider.translations(localization, data);
      });
    }
    var defaultLanguage = navigator.language.substring(0, 2);
    loadDictionary('es');
    loadDictionary('en');
    $translateProvider.preferredLanguage(defaultLanguage);
    document.head.setAttribute("lang", defaultLanguage);
  }]);
})();

"use strict";
Class("paella.editor.PaellaPlayer", paella.PaellaPlayer, {
  initialize: function(playerId) {
    this.parent(playerId);
    paella.events.bind(paella.events.loadComplete, function() {
      paella.$editor.load().then(function() {
        angular.bootstrap(document, [paella.editor.APP_NAME]);
        paella.keyManager.enabled = false;
      });
    });
    var backwBtn = $('#backward-btn')[0];
    var playBtn = $('#play-btn')[0];
    var pauseBtn = $('#pause-btn')[0];
    var forwBtn = $('#forward-btn')[0];
    $(pauseBtn).hide();
    $(playBtn).click(function(evt) {
      paella.player.play();
    });
    $(pauseBtn).click(function(evt) {
      paella.player.pause();
    });
    $(backwBtn).click(function(evt) {
      paella.player.videoContainer.currentTime().then(function(t) {
        var newtime = t - 30;
        paella.player.videoContainer.seekToTime(newtime);
      });
    });
    $(forwBtn).click(function(evt) {
      paella.player.videoContainer.currentTime().then(function(t) {
        var newtime = t + 30;
        paella.player.videoContainer.seekToTime(newtime);
      });
    });
    paella.events.bind(paella.events.play, function() {
      $(pauseBtn).show();
      $(playBtn).hide();
    });
    paella.events.bind(paella.events.pause, function() {
      $(pauseBtn).hide();
      $(playBtn).show();
    });
  },
  showPlaybackBar: function() {},
  play: function() {
    this.videoContainer.play();
  }
});
var PaellaPlayer = paella.editor.PaellaPlayer;

"use strict";
(function() {
  var UILayout = function() {
    function UILayout() {
      var $__2 = this;
      this.paellaVideoContainer = $('#paellaVideoContainer');
      this.sideBar = $('#sideBar');
      this.topContainer = $('#topContainer');
      this.timeLineBar = $('#timeLineBar');
      this.resizerH = $('#resizerH');
      this.resizerV = $('#resizerV');
      this.resizerH.setPosition = function(top) {
        base.cookies.set("editorResizerH", top / $(window).height());
        var percentTop = top * 100 / $(window).height();
        var percentBottom = 100 - percentTop;
        $__2.topContainer.css({"height": percentTop + '%'});
        $__2.timeLineBar.css({"height": percentBottom + '%'});
        $__2.resizerH.css({"top": percentTop + '%'});
        paella.player.onresize();
      };
      this.resizerH.minY = 30;
      this.resizerH.maxY = 80;
      var storedHeight = base.cookies.get("editorResizerH") || 0.6;
      this.resizerH.setPosition($(window).height() * storedHeight);
      this.resizerH.on("mousedown", function(evt) {
        $(document).on("mouseup", function(evt) {
          $(document).off("mouseup");
          $(document).off("mousemove");
        });
        $(document).on("mousemove", function(evt) {
          var minPercent = $__2.resizerH.minY;
          var minPx = $(window).height() * minPercent / 100;
          var maxPercent = $__2.resizerH.maxY;
          var maxPx = $(window).height() * maxPercent / 100;
          if (evt.clientY >= minPx && evt.clientY <= maxPx) {
            $__2.resizerH.setPosition(evt.clientY);
          }
        });
      });
      this.resizerV.setPosition = function(left) {
        base.cookies.set("editorResizerV", left / $(window).width());
        var percentLeft = left * 100 / $(window).width();
        var percentRight = 100 - percentLeft;
        $__2.paellaVideoContainer.css({"width": percentLeft + '%'});
        $__2.sideBar.css({"width": percentRight + '%'});
        $__2.resizerV.css({"left": percentLeft + '%'});
        paella.player.onresize();
      };
      this.resizerV.minX = 30;
      this.resizerV.maxX = 90;
      var storedWidth = base.cookies.get("editorResizerV") || 0.8;
      this.resizerV.setPosition($(window).width() * storedWidth);
      this.resizerV.on("mousedown", function(evt) {
        $(document).on("mouseup", function(evt) {
          $(document).off("mouseup");
          $(document).off("mousemove");
        });
        $(document).on("mousemove", function(evt) {
          var minPercent = $__2.resizerV.minX;
          var minPx = $(window).width() * minPercent / 100;
          var maxPercent = $__2.resizerV.maxX;
          var maxPx = $(window).width() * maxPercent / 100;
          if (evt.clientX >= minPx && evt.clientX < maxPx) {
            $__2.resizerV.setPosition(evt.clientX);
          }
        });
      });
    }
    return ($traceurRuntime.createClass)(UILayout, {}, {});
  }();
  paella.editor.UILayout = UILayout;
  paella.$editor = {
    config: {},
    load: function() {
      var $__2 = this;
      this.uiLayout = new paella.editor.UILayout();
      return new Promise(function(resolve, reject) {
        $.get("config/editor-config.json").then(function(data) {
          $__2.config = data;
          return paella.player.auth.canWrite();
        }, function() {
          reject();
        }).then(function(canWrite) {
          if (canWrite) {
            resolve();
          } else {
            var url = location.href;
            var result = /(\?.*)$/.exec(url);
            if (result) {}
          }
        });
      });
    }
  };
  var app = angular.module(paella.editor.APP_NAME);
  app.factory("PaellaEditor", ["$rootScope", "$timeout", "PluginManager", function($rootScope, $timeout, PluginManager) {
    var videoData = null;
    var currentTrackItem = {
      plugin: null,
      trackItem: null
    };
    var _editorLoaded = false;
    var _loadingEditor = false;
    function ensurePaellaEditorLoaded() {
      return new Promise(function(resolve) {
        if (_loadingEditor) {
          $timeout(function() {
            if (_editorLoaded) {
              resolve();
            }
          }, 100);
        } else {
          _loadingEditor = true;
          paella.player.videoContainer.masterVideo().getVideoData().then(function(data) {
            videoData = data;
            PluginManager.plugins().then(function(plugins) {
              var promisedTrackItems = [];
              service._tracks = [];
              plugins.trackPlugins.forEach(function(plugin) {
                var trackItemPromise = plugin.getTrackItems();
                if (!Array.isArray(trackItemPromise)) {
                  promisedTrackItems.push(trackItemPromise.then(function(trackItems) {
                    var depth = 0;
                    trackItems.forEach(function(item) {
                      item.depth = depth++;
                    });
                    service._tracks.push({
                      pluginId: plugin.getName(),
                      type: plugin.getTrackType(),
                      name: plugin.getTrackName(),
                      color: plugin.getColor(),
                      textColor: plugin.getTextColor(),
                      duration: videoData.duration,
                      allowResize: plugin.allowResize(),
                      allowMove: plugin.allowDrag(),
                      allowEditContent: plugin.allowEditContent(),
                      list: trackItems,
                      plugin: plugin
                    });
                  }));
                }
              });
              return Promise.all(promisedTrackItems);
            }).then(function() {
              _editorLoaded = true;
              resolve(service._tracks);
            });
          });
        }
      });
    }
    var trackItemSumary = {};
    var service = {
      _tracks: [],
      tools: [],
      currentTrack: null,
      currentTool: null,
      _isLoading: false,
      tracks: function() {
        var $__2 = this;
        return new Promise(function(resolve) {
          ensurePaellaEditorLoaded().then(function() {
            var newTrackItems = {};
            var newTrackItemData = {
              track: null,
              trackItem: null
            };
            var oldTrackItemCount = Object.keys(trackItemSumary).length;
            $__2._tracks.forEach(function(track) {
              track.list.forEach(function(trackItem) {
                var hash = (track.pluginId + "-" + trackItem.id);
                newTrackItems[hash] = trackItem;
                if (!trackItemSumary[hash] && oldTrackItemCount > 0 && newTrackItemData.track == null) {
                  newTrackItemData.track = track;
                  newTrackItemData.trackItem = trackItem;
                }
              });
            });
            trackItemSumary = newTrackItems;
            resolve($__2._tracks);
            if (newTrackItemData.track && newTrackItemData.trackItem) {
              $__2.selectTrackItem(newTrackItemData.track.plugin, newTrackItemData.trackItem);
            }
          });
        });
      },
      saveAll: function() {
        var $__2 = this;
        this.isLoading = true;
        return new Promise(function(resolve, reject) {
          $__2.tracks().then(function(tracks) {
            var promisedTasks = [];
            tracks.forEach(function(track) {
              promisedTasks.push(track.plugin.onSave());
            });
            Promise.all(promisedTasks).then(function() {
              $rootScope.$apply(function() {
                $__2.isLoading = false;
                resolve();
              });
            });
          });
        });
      },
      saveTrack: function(pluginId, trackData) {
        var $__2 = this;
        this.tracks().then(function(tracks) {
          tracks.forEach(function(t) {
            if (t.pluginId == pluginId) {
              var index = -1;
              t.list.some(function(trackItem, i) {
                if (trackItem.id == trackData.id) {
                  index = i;
                  return true;
                }
              });
              if (index >= 0) {
                t.list[index].s = trackData.s;
                t.list[index].e = trackData.e;
              }
              t.plugin.onTrackChanged(trackData.id, trackData.s, trackData.e);
              $rootScope.$apply();
            }
          });
          $__2.notify();
        });
      },
      saveTrackContent: function(pluginId, trackData) {
        var $__2 = this;
        this.tracks().then(function(tracks) {
          tracks.forEach(function(t) {
            if (t.pluginId == pluginId) {
              var index = -1;
              t.list.some(function(trackItem, i) {
                if (trackItem.id == trackData.id) {
                  index = i;
                  return true;
                }
              });
              if (index >= 0) {
                t.list[index].name = trackData.name;
              }
              t.plugin.onTrackContentChanged(trackData.id, trackData.name);
              $rootScope.$apply();
            }
          });
          $__2.notify();
        });
      },
      selectTrack: function(trackData) {
        if (!this.currentTrack || this.currentTrack.pluginId != trackData.pluginId) {
          var This = this;
          if (currentTrackItem.trackData) {
            currentTrackItem.trackData.selected = false;
          }
          if (trackData && trackData.list.length == 1) {
            trackData.list[0].selected = true;
          }
          this.currentTrack = trackData;
          this.currentTool = null;
          this._tracks.forEach(function(track) {
            track.selected = false;
            track.plugin.onToolSelected(trackData);
          });
          trackData.selected = true;
          this.tools = [];
          trackData.plugin.getTools().forEach(function(tool) {
            var isEnabled = This.currentTrack.plugin.isToolEnabled(tool);
            var isToggle = This.currentTrack.plugin.isToggleTool(tool);
            This.tools.push({
              name: tool,
              isEnabled: isEnabled,
              isToggle: isToggle
            });
          });
          this.notify();
        }
      },
      selectTool: function(toolName) {
        if (this.currentTrack.plugin.getTools().some(function(t) {
          return t == toolName;
        })) {
          this.currentTool = toolName;
          this.currentTrack.plugin.onToolSelected(toolName);
          this.notify();
        }
      },
      selectTrackItem: function(plugin, trackData, tracks) {
        if (plugin && plugin.setTimeOnSelect()) {
          paella.player.videoContainer.setCurrentTime(trackData.s);
        }
        if (currentTrackItem.plugin != plugin || !currentTrackItem.trackData || currentTrackItem.trackData.id != trackData.id) {
          if (currentTrackItem.trackData) {
            currentTrackItem.trackData.selected = false;
          }
          if (currentTrackItem.plugin) {
            currentTrackItem.plugin.onUnselect(currentTrackItem.trackData && currentTrackItem.trackData.id);
          }
          plugin.onSelect(trackData.id);
          currentTrackItem.plugin = plugin;
          currentTrackItem.trackData = trackData;
          currentTrackItem.trackData.selected = true;
          this.currentTrackItem = {
            trackData: trackData,
            plugin: plugin
          };
          this.notify();
        }
      },
      subscribe: function(scope, callback) {
        var handler = $rootScope.$on('notify-service-changed', callback);
        scope.$on('destroy', handler);
      },
      notify: function() {
        $rootScope.$emit('notify-service-changed');
      },
      plugins: function() {
        return PluginManager.plugins();
      }
    };
    ensurePaellaEditorLoaded().then(function() {
      $rootScope.$apply();
    });
    Object.defineProperty(service, 'isLoading', {
      get: function() {
        return this._isLoading;
      },
      set: function(v) {
        this._isLoading = v;
        service.notify();
      }
    });
    return service;
  }]);
})();

"use strict";
(function() {
  var app = angular.module(paella.editor.APP_NAME);
  var plugins = [];
  var pluginsLoaded = false;
  function registeredPlugins(callback) {
    var enablePluginsByDefault = false;
    var pluginsConfig = {};
    try {
      enablePluginsByDefault = paella.$editor.config.plugins.enablePluginsByDefault;
    } catch (e) {}
    try {
      pluginsConfig = paella.player.config.plugins.list;
    } catch (e) {}
    plugins.forEach(function(plugin) {
      var name = plugin.getName();
      var config = pluginsConfig[name];
      if (!config) {
        config = {enabled: enablePluginsByDefault};
      }
      callback(plugin, config);
    });
  }
  paella.editor.registerPlugin = function(plugin) {
    plugins.push(plugin);
  };
  app.factory("PluginManager", ["$timeout", "$rootScope", function($timeout, $rootScope) {
    var loadingPlugins = false;
    var pluginsLoaded = false;
    function loadPlugins() {
      return new Promise(function(resolve) {
        function waitFunc() {
          if (pluginsLoaded) {
            resolve();
          } else {
            $timeout(waitFunc, 100);
          }
        }
        if (!pluginsLoaded && loadingPlugins) {
          waitFunc();
        } else if (pluginsLoaded) {
          resolve();
        } else if (!loadingPlugins) {
          loadingPlugins = true;
          var pluginsPromises = [];
          registeredPlugins(function(registeredPlugin, config) {
            if (config.enabled) {
              registeredPlugin.config = config;
              var promise = new Promise(function(isEnabledResolve) {
                if (registeredPlugin.isEnabled) {
                  pluginsPromises.push();
                  registeredPlugin.isEnabled().then(function(isEnabled) {
                    if (isEnabled) {
                      addPlugin(registeredPlugin);
                    }
                    isEnabledResolve();
                  });
                } else {
                  isEnabledResolve();
                }
              });
              pluginsPromises.push(promise);
            }
          });
          Promise.all(pluginsPromises).then(function() {
            function sortFunc(a, b) {
              return a.getIndex() - b.getIndex();
            }
            service.trackPlugins.sort(sortFunc);
            service.sideBarPlugins.sort(sortFunc);
            service.toolbarPlugins.sort(sortFunc);
            pluginsLoaded = true;
            resolve();
          });
        }
      });
    }
    function addPlugin(plugin) {
      plugin.setup();
      if (plugin.type == 'editorTrackPlugin') {
        service.trackPlugins.push(plugin);
      }
      if (plugin.type == 'editorSideBarPlugin') {
        console.log(("Adding plugin " + plugin.getName()));
        service.sideBarPlugins.push(plugin);
      }
      if (plugin.type == 'editorToolbarPlugin') {
        service.toolbarPlugins.push(plugin);
      }
    }
    var service = {
      trackPlugins: [],
      sideBarPlugins: [],
      toolbarPlugins: [],
      plugins: function() {
        var $__1 = this;
        return new Promise(function(resolve) {
          loadPlugins().then(function() {
            resolve({
              trackPlugins: $__1.trackPlugins,
              sideBarPlugins: $__1.sideBarPlugins,
              toolbarPlugins: $__1.toolbarPlugins
            });
          });
        });
      },
      ready: function() {
        return loadPlugins();
      },
      onTrackChanged: function(newTrack) {
        this.sideBarPlugins.forEach(function(plugin) {
          plugin.onTrackSelected(newTrack);
        });
        this.toolbarPlugins.forEach(function(plugin) {
          plugin.onTrackSelected(newTrack);
        });
      },
      subscribeTrackReload: function(scope, callback) {
        var handler = $rootScope.$on('notify-track-reload', callback);
        scope.$on('destroy', handler);
      },
      notifyTrackChanged: function(plugin) {
        $rootScope.$emit('notify-track-reload');
      },
      onSave: function() {
        var promises = [];
        var handleOnSave = function(plugin) {
          promises.push(plugin.onSave());
        };
        this.trackPlugins.forEach(handleOnSave);
        this.sideBarPlugins.forEach(handleOnSave);
        this.toolbarPlugins.forEach(handleOnSave);
        return new Promise(function(resolve, reject) {
          Promise.all(promises).then(function() {
            return resolve();
          }).catch(function() {
            return reject();
          });
        });
      }
    };
    return service;
  }]);
  var EditorPlugin = function() {
    function EditorPlugin() {
      console.log("Registering plugin " + this.getName());
      paella.editor.registerPlugin(this);
    }
    return ($traceurRuntime.createClass)(EditorPlugin, {
      isEnabled: function() {
        return Promise.resolve(true);
      },
      setup: function() {},
      onSave: function() {
        return Promise.resolve();
      },
      onDiscard: function() {
        return Promise.resolve();
      },
      contextHelpString: function() {
        return "";
      }
    }, {});
  }();
  paella.editor.EditorPlugin = EditorPlugin;
  var TrackPlugin = function($__super) {
    function TrackPlugin() {
      $traceurRuntime.superConstructor(TrackPlugin).call(this);
      this.type = 'editorTrackPlugin';
    }
    return ($traceurRuntime.createClass)(TrackPlugin, {
      notifyTrackChanged: function() {
        var injector = angular.element(document).injector();
        var PluginManager = injector.get('PluginManager');
        PluginManager.notifyTrackChanged(this);
      },
      getIndex: function() {
        return 10000;
      },
      getName: function() {
        return "editorTrackPlugin";
      },
      getTrackName: function() {
        return "My Track";
      },
      getColor: function() {
        return "#5500FF";
      },
      getTextColor: function() {
        return "#F0F0F0";
      },
      getTrackType: function() {
        return "secondary";
      },
      getTrackItems: function() {
        var exampleTracks = [{
          id: 1,
          s: 10,
          e: 70
        }, {
          id: 2,
          s: 110,
          e: 340
        }];
        return exampleTracks;
      },
      allowResize: function() {
        return true;
      },
      allowDrag: function() {
        return true;
      },
      allowEditContent: function() {
        return true;
      },
      setTimeOnSelect: function() {
        return false;
      },
      onTrackChanged: function(id, start, end) {
        paella.events.trigger(paella.events.documentChanged);
      },
      onTrackContentChanged: function(id, content) {
        paella.events.trigger(paella.events.documentChanged);
      },
      onSelect: function(trackItemId) {
        base.log.debug('Track item selected: ' + this.getTrackName() + ", " + trackItemId);
      },
      onUnselect: function() {
        base.log.debug('Track list unselected: ' + this.getTrackName());
      },
      onDblClick: function(trackData) {},
      getTools: function() {
        return [];
      },
      onToolSelected: function(toolName) {
        paella.events.trigger(paella.events.documentChanged);
      },
      isToolEnabled: function(toolName) {
        return true;
      },
      isToggleTool: function(toolName) {
        return true;
      },
      buildToolTabContent: function(tabContainer) {},
      getSettings: function() {
        return null;
      }
    }, {}, $__super);
  }(paella.editor.EditorPlugin);
  paella.editor.TrackPlugin = TrackPlugin;
  var MainTrackPlugin = function($__super) {
    function MainTrackPlugin() {
      $traceurRuntime.superConstructor(MainTrackPlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(MainTrackPlugin, {
      getTrackType: function() {
        return "master";
      },
      getTrackItems: function() {
        var exampleTracks = [{
          id: 1,
          s: 30,
          e: 470
        }];
        return exampleTracks;
      },
      getName: function() {
        return "editorMainTrackPlugin";
      }
    }, {}, $__super);
  }(paella.editor.TrackPlugin);
  paella.editor.MainTrackPlugin = MainTrackPlugin;
  var SideBarPlugin = function($__super) {
    function SideBarPlugin() {
      $traceurRuntime.superConstructor(SideBarPlugin).call(this);
      this.type = 'editorSideBarPlugin';
    }
    return ($traceurRuntime.createClass)(SideBarPlugin, {
      getIndex: function() {
        return 10000;
      },
      getName: function() {
        return "editorSideBarPlugin";
      },
      getTabName: function() {
        return "My Side bar Plugin";
      },
      getContent: function() {},
      onLoadFinished: function() {}
    }, {}, $__super);
  }(paella.editor.EditorPlugin);
  paella.editor.SideBarPlugin = SideBarPlugin;
  var EditorToolbarPlugin = function($__super) {
    function EditorToolbarPlugin() {
      $traceurRuntime.superConstructor(EditorToolbarPlugin).call(this);
      this.type = editorToolbarPlugin;
      this.trackList = [];
    }
    return ($traceurRuntime.createClass)(EditorToolbarPlugin, {
      getIndex: function() {
        return 10000;
      },
      getName: function() {
        return "editorToolbarPlugin";
      },
      getButtonName: function() {
        return "Toolbar Plugin";
      },
      getIcon: function() {
        return "icon-edit";
      },
      getOptions: function() {
        return [];
      },
      onOptionSelected: function(optionIndex) {}
    }, {}, $__super);
  }(paella.editor.EditorPlugin);
  paella.editor.EditorToolbarPlugin = EditorToolbarPlugin;
})();

"use strict";
(function() {
  var app = angular.module(paella.editor.APP_NAME);
  app.directive("timeLine", function() {
    return {
      restrict: "E",
      templateUrl: "templates/timeline.html",
      controller: ["$scope", "$translate", "PaellaEditor", "PluginManager", function($scope, $translate, PaellaEditor, PluginManager) {
        $scope.zoom = 100;
        $scope.zoomOptions = {
          floor: 100,
          ceil: 5000
        };
        $scope.trackSelector = {isOpen: false};
        $scope.divisionWidth = 60;
        $scope.currentTime = toTextTime(0);
        function toTextTime(time) {
          var hours = Math.floor(time / (60 * 60));
          var seconds = time % (60 * 60);
          var minutes = Math.floor(seconds / 60);
          seconds = Math.ceil(seconds % 60);
          return hours + ":" + (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
        }
        function setTimeMark(time) {
          var p = time.currentTime * $scope.zoom / time.duration;
          $('#time-mark').css({left: p + '%'});
          var timeMarkOffset = $('#time-mark').offset();
          var leftOffset = 200;
          if (timeMarkOffset.left - leftOffset < 0 || timeMarkOffset.left > $(window).width()) {
            $('.timeline-zoom-container')[0].scrollLeft += timeMarkOffset.left - leftOffset;
          }
        }
        paella.events.bind(paella.events.timeUpdate, function(evt, time) {
          setTimeMark(time);
          $scope.currentTime = toTextTime(time.currentTime);
          $scope.$apply();
        });
        function setTime(clientX) {
          var left = $('.timeline-zoom-container')[0].scrollLeft;
          var width = $('#timeline-ruler').width();
          var offset = clientX - $(window).width() * 0.1;
          left = left * 100 / width;
          offset = offset * 100 / width;
          paella.player.videoContainer.seekTo(offset + left);
        }
        function buildTimeDivisions(divisionWidth) {
          paella.player.videoContainer.duration().then(function(duration) {
            var width = $('#timeline-content').width();
            var numberOfDivisions = Math.floor(width / divisionWidth);
            var timelineRuler = $('#timeline-ruler')[0];
            timelineRuler.innerHTML = "";
            var timeIncrement = divisionWidth * duration / width;
            var time = 0;
            for (var i = 0; i < numberOfDivisions; ++i) {
              var elem = document.createElement('span');
              elem.className = 'time-division';
              var hours = Math.floor(time / (60 * 60));
              var seconds = time % (60 * 60);
              var minutes = Math.floor(seconds / 60);
              seconds = Math.ceil(seconds % 60);
              elem.innerHTML = hours + ":" + (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
              $(elem).css({width: divisionWidth + 'px'});
              timelineRuler.appendChild(elem);
              time += timeIncrement;
            }
          });
        }
        $(window).resize(function(evt) {
          buildTimeDivisions($scope.divisionWidth);
        });
        $('#timeline-ruler-action').on('mousedown', function(evt) {
          setTime(evt.clientX);
          function cancelTracking() {
            $('#timeline-ruler-action').off("mouseup");
            $('#timeline-ruler-action').off("mousemove");
            $('#timeline-ruler-action').off("mouseout");
          }
          $('#timeline-ruler-action').on('mouseup', cancelTracking);
          $('#timeline-ruler-action').on('mouseout', cancelTracking);
          $('#timeline-ruler-action').on('mousemove', function(evt) {
            setTime(evt.clientX);
          });
        });
        $scope.selectTrack = function(t) {
          PaellaEditor.selectTrack(t);
        };
        $scope.selectTool = function(tool) {
          if (tool.isEnabled) {
            PaellaEditor.selectTool(tool.name);
          }
        };
        $scope.saveAndClose = function() {
          PaellaEditor.saveAll().then(function() {
            $scope.closeEditor(true);
          });
        };
        $scope.saveChanges = function() {
          PaellaEditor.saveAll();
        };
        $scope.closeEditor = function(noConfirm) {
          if (noConfirm || confirm($translate.instant("Are you sure you want to discard all changes and close editor?"))) {
            location.href = location.href.replace("editor.html", "index.html");
          }
        };
        $scope.$watch('tracks', function() {});
        $scope.$watch('zoom', function() {
          $('#timeline-content').css({width: $scope.zoom + "%"});
          buildTimeDivisions($scope.divisionWidth);
          paella.player.videoContainer.currentTime().then(function(time) {
            setTimeMark(time);
          });
        });
        $scope.setTimeToCursor = function(evt) {
          setTimeout(function() {
            setTime(evt.clientX);
          }, 50);
        };
        function reloadTracks() {
          PaellaEditor.tracks().then(function(tracks) {
            $scope.tracks = tracks;
            $scope.currentTrack = PaellaEditor.currentTrack;
            $scope.tools = PaellaEditor.tools;
            $scope.currentTool = PaellaEditor.currentTool;
            $scope.$apply();
          });
        }
        reloadTracks();
        PaellaEditor.subscribe($scope, function() {
          $scope.currentTrack = PaellaEditor.currentTrack;
          $scope.tools = PaellaEditor.tools;
          $scope.currentTool = PaellaEditor.currentTool;
        });
        PluginManager.subscribeTrackReload($scope, function() {
          reloadTracks();
        });
      }]
    };
  });
  app.directive("track", function() {
    function cancelMouseTracking() {
      $(document).off("mouseup");
      $(document).off("mousemove");
    }
    return {
      restrict: "E",
      templateUrl: "templates/track.html",
      scope: {data: "="},
      controller: ["$scope", "PaellaEditor", "PluginManager", function($scope, PaellaEditor, PluginManager) {
        $scope.pluginId = $scope.data.pluginId;
        $scope.name = $scope.data.name;
        $scope.color = $scope.data.color;
        $scope.textColor = $scope.data.textColor || 'black';
        $scope.tracks = $scope.data.list;
        $scope.duration = $scope.data.duration;
        $scope.allowResize = $scope.data.allowResize;
        $scope.allowMove = $scope.data.allowMove;
        $scope.plugin = $scope.data.plugin;
        $scope.img = $scope.data.img;
        $scope.getStyle = function(item) {
          var style = ("color: " + $scope.textColor + "; background-color: " + $scope.color + ";");
          if (item.img) {
            style += (" background-image: url(" + item.img + "); background-size: auto 100%;");
          }
          return style;
        };
        function selectTrackItem(trackData, tracks) {
          PaellaEditor.selectTrack(tracks);
          PaellaEditor.selectTrackItem($scope.plugin, trackData, tracks);
        }
        $scope.highlightTrack = function(trackData) {
          PaellaEditor.tracks().then(function(tracks) {
            tracks.forEach(function(track) {
              track.list.forEach(function(trackItem) {
                trackItem.selected = false;
              });
            });
          });
          trackData.selected = true;
        };
        $scope.getLeft = function(trackData) {
          return (100 * trackData.s / $scope.duration);
        };
        $scope.getWidth = function(trackData) {
          return (100 * (trackData.e - trackData.s) / $scope.duration);
        };
        $scope.getDepth = function(trackData) {
          return $(window).width() - Math.round(trackData.e - trackData.s);
        };
        $scope.getTrackItemId = function(trackData) {
          return "track-" + $scope.pluginId + "-" + trackData.id;
        };
        $scope.leftHandlerDown = function(event, trackData, tracks) {
          selectTrackItem(trackData, tracks);
          if ($scope.allowResize) {
            var mouseDown = event.clientX;
            $(document).on("mousemove", function(evt) {
              var delta = evt.clientX - mouseDown;
              var elem = $('#' + $scope.getTrackItemId(trackData));
              var trackWidth = elem.width();
              var diff = delta * (trackData.e - trackData.s) / trackWidth;
              var s = trackData.s + diff;
              if (s > 0 && s < trackData.e) {
                trackData.s = s;
                PaellaEditor.saveTrack($scope.pluginId, trackData);
                mouseDown = evt.clientX;
              } else {
                cancelMouseTracking();
              }
            });
            $(document).on("mouseup", function(evt) {
              cancelMouseTracking();
            });
          }
        };
        $scope.centerHandlerDown = function(event, trackData, tracks) {
          selectTrackItem(trackData, tracks);
          if ($scope.allowMove) {
            var mouseDown = event.clientX;
            $(document).on("mousemove", function(evt) {
              var delta = evt.clientX - mouseDown;
              var elem = $('#' + $scope.getTrackItemId(trackData));
              var trackWidth = elem.width();
              var diff = delta * (trackData.e - trackData.s) / trackWidth;
              var s = trackData.s + diff;
              var e = trackData.e + diff;
              if (s > 0 && e <= $scope.duration) {
                trackData.s = s;
                trackData.e = e;
                PaellaEditor.saveTrack($scope.pluginId, trackData);
                mouseDown = evt.clientX;
              } else {
                cancelMouseTracking();
              }
            });
            $(document).on("mouseup", function(evt) {
              cancelMouseTracking();
            });
          }
        };
        $scope.rightHandlerDown = function(event, trackData, tracks) {
          selectTrackItem(trackData, tracks);
          if ($scope.allowResize) {
            var mouseDown = event.clientX;
            $(document).on("mousemove", function(evt) {
              var delta = evt.clientX - mouseDown;
              var elem = $('#' + $scope.getTrackItemId(trackData));
              var trackWidth = elem.width();
              var diff = delta * (trackData.e - trackData.s) / trackWidth;
              var e = trackData.e + diff;
              if (e <= $scope.duration && e > trackData.s) {
                trackData.e = e;
                PaellaEditor.saveTrack($scope.pluginId, trackData);
                mouseDown = evt.clientX;
              } else {
                cancelMouseTracking();
              }
            });
            $(document).on("mouseup", function(evt) {
              cancelMouseTracking();
            });
          }
        };
      }]
    };
  });
})();

"use strict";
(function() {
  var app = angular.module(paella.editor.APP_NAME);
  function SidebarController($scope, PaellaEditor) {
    $scope.plugins = [];
    $scope.tabs = [];
    $scope.selectedPlugin = null;
    $scope.isSelected = function(plugin) {
      return plugin == $scope.selectedPlugin;
    };
    $scope.selectTab = function(plugin) {
      $scope.selectedPlugin = plugin;
    };
    $scope.insertDirective = function(plugin, node) {};
    PaellaEditor.plugins().then(function(plugins) {
      $scope.plugins = plugins.sideBarPlugins;
      console.log($scope.plugins);
      $scope.selectedPlugin = $scope.plugins[0];
      $scope.$apply();
    });
  }
  app.directive("sideBar", ['$compile', 'PaellaEditor', function($compile, PaellaEditor) {
    return {
      restrict: "E",
      templateUrl: "templates/sideBar.html",
      link: function(scope, element, attrs) {
        var $scope = scope;
        $scope.plugins = [];
        $scope.tabs = [];
        $scope.selectedPlugin = null;
        var tabContainer = null;
        function createTabContainer() {
          if (tabContainer) {
            tabContainer.html('');
          }
          tabContainer = $compile('<div></div>')(scope);
          element.append(tabContainer);
        }
        function insertTabContents(plugin) {
          createTabContainer();
          var directiveName = plugin.getDirectiveName();
          var tabContent = $compile(("<" + directiveName + "></" + directiveName + ">"))(scope);
          tabContainer.append(tabContent);
        }
        $scope.isSelected = function(plugin) {
          return plugin == $scope.selectedPlugin;
        };
        $scope.selectTab = function(plugin) {
          $scope.selectedPlugin = plugin;
          insertTabContents(plugin);
        };
        PaellaEditor.plugins().then(function(plugins) {
          $scope.plugins = plugins.sideBarPlugins;
          if ($scope.plugins.length) {
            insertTabContents($scope.plugins[0]);
          }
          $scope.selectedPlugin = $scope.plugins[0];
          $scope.$apply();
        });
        createTabContainer();
      }
    };
  }]);
})();

"use strict";
(function() {
  var app = angular.module(paella.editor.APP_NAME);
  app.directive("loader", function() {
    return {
      restrict: "E",
      templateUrl: "templates/loader.html",
      scope: {},
      controller: ["$scope", "PaellaEditor", function($scope, PaellaEditor) {
        $scope.loading = PaellaEditor.isLoading;
        PaellaEditor.subscribe($scope, function() {
          $scope.loading = PaellaEditor.isLoading;
        });
      }]
    };
  });
})();

"use strict";
(function() {
  var BreaksEditorPlugin = function($__super) {
    function BreaksEditorPlugin() {
      $traceurRuntime.superConstructor(BreaksEditorPlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(BreaksEditorPlugin, {
      isEnabled: function() {
        var $__2 = this;
        this._tracks = [];
        return new Promise(function(resolve) {
          paella.data.read('breaks', {id: paella.initDelegate.getId()}, function(data, status) {
            if (data && $traceurRuntime.typeof((data)) == 'object' && data.breaks && data.breaks.length > 0) {
              $__2._tracks = data.breaks;
              resolve(true);
            } else {
              resolve(true);
            }
          });
        });
      },
      getIndex: function() {
        return 102;
      },
      getName: function() {
        return "breakEditorPlugin";
      },
      getTrackName: function() {
        return "Break";
      },
      getColor: function() {
        return "#0D949F";
      },
      getTextColor: function() {
        return "black";
      },
      getTrackItems: function() {
        return Promise.resolve(this._tracks);
      },
      getTools: function() {
        return ["Create", "Delete"];
      },
      onToolSelected: function(toolName) {
        var $__2 = this;
        if (toolName == "Delete" && this._currentId) {
          var deleteIndex = -1;
          this._tracks.some(function(track, index) {
            if (track.id == $__2._currentId) {
              deleteIndex = index;
            }
          });
          if (deleteIndex != -1) {
            this._tracks.splice(deleteIndex, 1);
            this.notifyTrackChanged();
          }
        } else if (toolName == "Create") {
          var id = 1;
          var done = false;
          while (!done) {
            if (this._tracks.some(function(t) {
              if (id == t.id) {
                return true;
              }
            })) {
              ++id;
            } else {
              done = true;
            }
          }
          paella.player.videoContainer.currentTime().then(function(time) {
            $__2._tracks.push({
              id: id,
              s: time,
              e: time + 60,
              text: "Break"
            });
            $__2.notifyTrackChanged();
          });
        }
      },
      allowResize: function() {
        return true;
      },
      allowDrag: function() {
        return true;
      },
      allowEditContent: function() {
        return true;
      },
      setTimeOnSelect: function() {
        return true;
      },
      onTrackChanged: function(id, start, end) {
        this._tracks.some(function(t) {
          if (t.id == id) {
            t.s = start;
            t.e = end;
          }
        });
      },
      onSelect: function(trackItemId) {
        this._currentId = trackItemId;
      },
      onUnselect: function(id) {
        this._currentId = null;
      },
      onSave: function() {
        var $__2 = this;
        return new Promise(function(resolve, reject) {
          var data = {breaks: $__2._tracks};
          paella.data.write('breaks', {id: paella.initDelegate.getId()}, data, function(response, status) {
            resolve();
          });
        });
      }
    }, {}, $__super);
  }(paella.editor.MainTrackPlugin);
  new BreaksEditorPlugin();
})();

"use strict";
(function() {
  var SlidesEditorPlugin = function($__super) {
    function SlidesEditorPlugin() {
      $traceurRuntime.superConstructor(SlidesEditorPlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(SlidesEditorPlugin, {
      isEnabled: function() {
        var frames = paella.player.videoLoader.frameList;
        return Promise.resolve(Object.keys(frames).length);
      },
      getIndex: function() {
        return 101;
      },
      getName: function() {
        return "slidesEditorPlugin";
      },
      getTrackName: function() {
        return "Slides";
      },
      getColor: function() {
        return "#EEEEEE";
      },
      getTextColor: function() {
        return "black";
      },
      getTrackItems: function() {
        return new Promise(function(resolve, reject) {
          paella.player.videoContainer.duration().then(function(duration) {
            var frames = paella.player.videoLoader.frameList;
            var result = [];
            var last = null;
            for (var index in frames) {
              if (last) {
                last.e = frames[index].time;
              }
              last = {
                id: index,
                s: frames[index].time,
                e: duration,
                img: frames[index].thumb || frames[index].url
              };
              result.push(last);
            }
            resolve(result);
          });
        });
      },
      allowResize: function() {
        return false;
      },
      allowDrag: function() {
        return false;
      },
      allowEditContent: function() {
        return false;
      },
      setTimeOnSelect: function() {
        return true;
      },
      onTrackChanged: function(id, start, end) {},
      onSave: function() {}
    }, {}, $__super);
  }(paella.editor.MainTrackPlugin);
  new SlidesEditorPlugin();
})();

"use strict";
(function() {
  var TestPlugin = function($__super) {
    function TestPlugin() {
      $traceurRuntime.superConstructor(TestPlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(TestPlugin, {
      isEnabled: function() {
        return Promise.resolve(false);
      },
      getIndex: function() {
        return 10000;
      },
      getName: function() {
        return "testTrackPlugin";
      },
      getTrackName: function() {
        return "Track test";
      },
      getColor: function() {
        return "#5500FF";
      },
      getTextColor: function() {
        return "#F0F0F0";
      },
      getTrackItems: function() {
        return new Promise(function(resolve, reject) {
          resolve([{
            id: 1,
            s: 10,
            e: 70,
            name: "Track item 1"
          }, {
            id: 2,
            s: 110,
            e: 340,
            name: "second track item"
          }]);
        });
      },
      allowResize: function() {
        return true;
      },
      allowDrag: function() {
        return true;
      },
      allowEditContent: function() {
        return true;
      },
      setTimeOnSelect: function() {
        return true;
      },
      onTrackChanged: function(id, start, end) {},
      onTrackContentChanged: function(id, content) {},
      onSelect: function(trackItemId) {
        this._currentId = trackItemId;
      },
      onUnselect: function(id) {
        this._currentId = null;
      },
      onDblClick: function(trackData) {},
      getTools: function() {
        return ["Tool 1", "Tool 2"];
      },
      onToolSelected: function(toolName) {
        console.log('Tool selected: ' + toolName);
      },
      isToolEnabled: function(toolName) {
        return true;
      },
      isToggleTool: function(toolName) {
        return toolName == "Tool 1";
      },
      buildToolTabContent: function(tabContainer) {},
      getSettings: function() {
        return null;
      }
    }, {}, $__super);
  }(paella.editor.TrackPlugin);
  new TestPlugin();
  var TestPlugin2 = function($__super) {
    function TestPlugin2() {
      $traceurRuntime.superConstructor(TestPlugin2).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(TestPlugin2, {
      isEnabled: function() {
        return Promise.resolve(false);
      },
      getIndex: function() {
        return 9000;
      },
      getName: function() {
        return "testTrackPlugin2";
      },
      getTrackName: function() {
        return "Track test 2";
      },
      getColor: function() {
        return "#AA2211";
      },
      getTextColor: function() {
        return "black";
      },
      getTrackItems: function() {
        return new Promise(function(resolve, reject) {
          resolve([{
            id: 1,
            s: 10,
            e: 550
          }]);
        });
      },
      allowResize: function() {
        return true;
      },
      allowDrag: function() {
        return false;
      },
      allowEditContent: function() {
        return false;
      },
      onTrackChanged: function(id, start, end) {},
      onTrackContentChanged: function(id, content) {},
      onSave: function() {
        return new Promise(function(resolve, reject) {
          resolve();
        });
      },
      onSelect: function(trackItemId) {
        console.log('Track item selected: ' + this.getTrackName() + ", " + trackItemId);
      },
      onUnselect: function(id) {
        console.log('Track list unselected: ' + this.getTrackName() + ", " + id);
      },
      onDblClick: function(trackData) {},
      getTools: function() {
        return [];
      },
      onToolSelected: function(toolName) {
        paella.events.trigger(paella.events.documentChanged);
      },
      isToolEnabled: function(toolName) {
        return true;
      },
      getSettings: function() {
        return null;
      }
    }, {}, $__super);
  }(paella.editor.MainTrackPlugin);
  new TestPlugin2();
  var app = angular.module(paella.editor.APP_NAME);
  app.directive("sidebar2", function() {
    return {
      restrict: "E",
      templateUrl: "templates/es.upv.paella-editor.test/content.html",
      controller: ["$scope", "PaellaEditor", function($scope, PaellaEditor) {
        $scope.title = "Hello sidebar 2";
        $scope.trackName = "";
        PaellaEditor.subscribe($scope, function() {
          $scope.currentTrack = PaellaEditor.currentTrack;
          if ($scope.currentTrack) {
            $scope.trackName = $scope.currentTrack.name;
          }
        });
      }]
    };
  });
  var TestSideBar2 = function($__super) {
    function TestSideBar2() {
      $traceurRuntime.superConstructor(TestSideBar2).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(TestSideBar2, {
      isEnabled: function() {
        return Promise.resolve(false);
      },
      getName: function() {
        return "My side bar plugin 2";
      },
      getTabName: function() {
        return "Sidebar 2";
      },
      getContent: function() {},
      getDirectiveName: function() {
        return "sidebar2";
      }
    }, {}, $__super);
  }(paella.editor.SideBarPlugin);
  new TestSideBar2();
  app.directive("testSidebar", function() {
    return {
      restrict: "E",
      templateUrl: "templates/es.upv.paella-editor.test/plugin2.html",
      controller: ["$scope", "PaellaEditor", function($scope, PaellaEditor) {
        $scope.message = "I'm another plugin.";
      }]
    };
  });
  var SidebarPlugin2 = function($__super) {
    function SidebarPlugin2() {
      $traceurRuntime.superConstructor(SidebarPlugin2).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(SidebarPlugin2, {
      isEnabled: function() {
        return Promise.resolve(false);
      },
      getName: function() {
        return "other sidebar plugin";
      },
      getTabName: function() {
        return "Han Solo";
      },
      getDirectiveName: function() {
        return "test-sidebar";
      }
    }, {}, $__super);
  }(paella.editor.SideBarPlugin);
  new SidebarPlugin2();
})();

"use strict";
(function() {
  var app = angular.module(paella.editor.APP_NAME);
  app.directive("trackInfo", function() {
    return {
      restrict: "E",
      templateUrl: "templates/es.upv.paella-editor.trackInfo/track-info.html",
      controller: ["$scope", "PaellaEditor", function($scope, PaellaEditor) {
        $scope.trackName = "";
        PaellaEditor.subscribe($scope, function() {
          $scope.currentTrack = PaellaEditor.currentTrack;
          if ($scope.currentTrack) {
            $scope.trackName = $scope.currentTrack.name;
          }
        });
      }]
    };
  });
  var TrackInfoPlugin = function($__super) {
    function TrackInfoPlugin() {
      $traceurRuntime.superConstructor(TrackInfoPlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(TrackInfoPlugin, {
      isEnabled: function() {
        return Promise.resolve(true);
      },
      getName: function() {
        return "trackInfoSidebar";
      },
      getTabName: function() {
        return "Track info";
      },
      getDirectiveName: function() {
        return "track-info";
      }
    }, {}, $__super);
  }(paella.editor.SideBarPlugin);
  new TrackInfoPlugin();
})();

"use strict";
(function() {
  var TrimmingEditorPlugin = function($__super) {
    function TrimmingEditorPlugin() {
      $traceurRuntime.superConstructor(TrimmingEditorPlugin).apply(this, arguments);
    }
    return ($traceurRuntime.createClass)(TrimmingEditorPlugin, {
      isEnabled: function() {
        return new Promise(function(resolve, reject) {
          var videoId = paella.initDelegate.getId();
          paella.data.read('trimming', {id: videoId}, function(data, status) {
            if (data && status && data.end > 0) {
              paella.player.videoContainer.setTrimming(data.start, data.end).then(function() {
                return resolve(true);
              });
            } else {
              var startTime = base.parameters.get('start');
              var endTime = base.parameters.get('end');
              if (startTime && endTime) {
                paella.player.videoContainer.setTrimming(startTime, endTime).then(function() {
                  return resolve(true);
                });
              } else {
                resolve(true);
              }
            }
          });
        });
      },
      getIndex: function() {
        return 100;
      },
      getName: function() {
        return "trimmingEditorPluginV2";
      },
      getTrackName: function() {
        return "Trimming";
      },
      getColor: function() {
        return "#AA2211";
      },
      getTextColor: function() {
        return "black";
      },
      getTrackItems: function() {
        var $__2 = this;
        return new Promise(function(resolve, reject) {
          var trimming = {};
          paella.player.videoContainer.trimming().then(function(t) {
            trimming = t;
            return paella.player.videoContainer.duration();
          }).then(function(d) {
            $__2._start = trimming.start;
            $__2._end = trimming.end || d;
            return resolve([{
              id: 1,
              s: trimming.start,
              e: trimming.end || d
            }]);
          });
        });
      },
      allowResize: function() {
        return true;
      },
      allowDrag: function() {
        return false;
      },
      allowEditContent: function() {
        return false;
      },
      onTrackChanged: function(id, start, end) {
        this._start = start;
        this._end = end;
        console.log(("From " + this._start + " to " + this._end));
      },
      onSave: function() {
        var $__2 = this;
        return new Promise(function(resolve, reject) {
          if ($__2._start !== undefined) {
            paella.data.write('trimming', {id: paella.initDelegate.getId()}, {
              start: $__2._start,
              end: $__2._end
            }, function(data, status) {
              resolve();
            });
          } else {
            resolve();
          }
        });
      }
    }, {}, $__super);
  }(paella.editor.MainTrackPlugin);
  new TrimmingEditorPlugin();
})();

