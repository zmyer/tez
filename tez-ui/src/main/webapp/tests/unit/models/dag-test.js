/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Ember from 'ember';
import { moduleForModel, test } from 'ember-qunit';

moduleForModel('dag', 'Unit | Model | dag', {
  // Specify the other units that are required for this test.
  needs: []
});

test('Basic creation test', function(assert) {
  let model = this.subject(),
      testQueue = "TQ";

  Ember.run(function () {
    model.set("app", {
      queue: testQueue
    });

    assert.ok(!!model);
    assert.ok(!!model.needs.am);
    assert.ok(!!model.needs.info);
    assert.equal(model.get("queue"), testQueue);
  });

  assert.ok(model.name);
  assert.ok(model.submitter);

  assert.ok(model.vertices);
  assert.ok(model.edges);
  assert.ok(model.vertexGroups);

  assert.ok(model.domain);
  assert.ok(model.containerLogs);

  assert.ok(model.vertexIdNameMap);
  assert.ok(model.vertexNameIdMap);

  assert.ok(model.callerID);
  assert.ok(model.callerContext);
  assert.ok(model.callerDescription);
  assert.ok(model.callerType);

  assert.ok(model.dagPlan);
  assert.ok(model.callerData);
  assert.ok(model.info);

  assert.ok(model.amWsVersion);
  assert.ok(model.failedTaskAttempts);
  assert.ok(model.finalStatus);
});

test('app loadType test', function(assert) {
  let loadType = this.subject().get("needs.app.loadType"),
      record = Ember.Object.create();

  assert.equal(loadType(record), undefined);

  record.set("queueName", "Q");
  assert.equal(loadType(record), "demand");

  record.set("atsStatus", "RUNNING");
  assert.equal(loadType(record), undefined);

  record.set("atsStatus", "SUCCEEDED");
  assert.equal(loadType(record), "demand");

  record.set("queueName", undefined);
  assert.equal(loadType(record), undefined);
});

test('status test', function(assert) {
  let model = this.subject();

  Ember.run(function () {
    model.set("status", "SUCCEEDED");
    assert.equal(model.get("status"), "SUCCEEDED");
    assert.equal(model.get("finalStatus"), "SUCCEEDED");

    model.set("failedTaskAttempts", 1);
    assert.equal(model.get("status"), "SUCCEEDED");
    assert.equal(model.get("finalStatus"), "SUCCEEDED_WITH_FAILURES");
  });
});

test('queue test', function(assert) {
  let model = this.subject(),
      queueName = "queueName",
      appQueueName = "AppQueueName";

  assert.equal(model.get("queue"), undefined);

  Ember.run(function () {
    model.set("app", {
      queue: appQueueName
    });
    assert.equal(model.get("queue"), appQueueName);

    model.set("queueName", queueName);
    assert.equal(model.get("queue"), queueName);
  });
});

test('vertices, edges & vertexGroups test', function(assert) {
  let testVertices = {},
      testEdges = {},
      testVertexGroups = {},
      model = this.subject({
        dagPlan: {
          vertices: testVertices,
          edges: testEdges,
          vertexGroups: testVertexGroups
        }
      });

  assert.equal(model.get("vertices"), testVertices);
  assert.equal(model.get("edges"), testEdges);
  assert.equal(model.get("vertexGroups"), testVertexGroups);

  Ember.run(function () {
    testVertices = {};
    testEdges = {};
    testVertexGroups = {};

    model.set("info", {
      dagPlan: {
        vertices: testVertices,
        edges: testEdges,
        vertexGroups: testVertexGroups
      }
    });
    assert.notEqual(model.get("vertices"), testVertices);
    assert.notEqual(model.get("edges"), testEdges);
    assert.notEqual(model.get("vertexGroups"), testVertexGroups);

    model.set("dagPlan", null);
    assert.equal(model.get("vertices"), testVertices);
    assert.equal(model.get("edges"), testEdges);
    assert.equal(model.get("vertexGroups"), testVertexGroups);
  });
});
