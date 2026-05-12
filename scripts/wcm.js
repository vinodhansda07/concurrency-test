import { callTool } from '../lib/mcp-client.js';
import { TEST_DATA } from '../config.js';

export function runRaceSiteAreaSameName() {
  callTool('create_site_area_in_WCM', {
    name: __ENV.RACE_SITE_AREA_NAME || 'TestPage',
    libraryId: TEST_DATA.libraryId,
    templateId: TEST_DATA.templateId,
    presentationTemplateId: TEST_DATA.presentationTemplateId,
    description: 'race-create same name',
  }, { scenario_id: '2.1', race: 'site-area-same-name' });
}

export function runRaceDeleteSameSiteArea() {
  if (!TEST_DATA.siteAreaId) {
    return;
  }

  callTool('delete_site_area_from_WCM', {
    siteAreaId: TEST_DATA.siteAreaId,
  }, { scenario_id: '2.4', race: 'delete-same-site-area' });
}

export function runRaceUpdateSameContent() {
  if (!TEST_DATA.contentId) {
    return;
  }

  callTool('update_DX_content_in_WCM', {
    contentId: TEST_DATA.contentId,
    content: `<p>Race update by VU ${__VU}, ITER ${__ITER}</p>`,
  }, { scenario_id: '4.2', race: 'update-same-content' });
}

export function runWcmScenarios() {
  // 2.1 same-name site area race
  callTool('create_site_area_in_WCM', {
    name: 'TestPage',
    libraryId: TEST_DATA.libraryId,
    templateId: TEST_DATA.templateId,
    presentationTemplateId: TEST_DATA.presentationTemplateId,
    description: 'race-create same name',
  }, { scenario_id: '2.1' });

  // 2.2 different-name create
  callTool('create_site_area_in_WCM', {
    name: `Page-${__VU}-${__ITER}`,
    libraryId: TEST_DATA.libraryId,
    templateId: TEST_DATA.templateId,
    presentationTemplateId: TEST_DATA.presentationTemplateId,
    description: 'race-create different names',
  }, { scenario_id: '2.2' });

  // 2.4 concurrent delete same site area
  if (TEST_DATA.siteAreaId) {
    callTool('delete_site_area_from_WCM', {
      siteAreaId: TEST_DATA.siteAreaId,
    }, { scenario_id: '2.4' });
  }

  // 2.5 get while delete
  if (TEST_DATA.libraryId) {
    callTool('get_site_areas_from_WCM', {
      libraryId: TEST_DATA.libraryId,
    }, { scenario_id: '2.5' });
  }

  // 3.1 template create same name
  callTool('create_content_template_in_WCM', {
    name: 'MyTemplate',
    libraryId: TEST_DATA.libraryId,
  }, { scenario_id: '3.1' });

  // 3.2 delete template while in use
  if (TEST_DATA.templateId) {
    callTool('delete_content_template_from_WCM', {
      contentTemplateId: TEST_DATA.templateId,
    }, { scenario_id: '3.2' });
  }

  // 3.3 template batch create shape
  callTool('create_content_template_in_WCM', {
    name: `Template_${__VU}_${__ITER}`,
    libraryId: TEST_DATA.libraryId,
  }, { scenario_id: '3.3' });

  // 4.1 create content same name
  callTool('create_DX_content_in_WCM', {
    name: 'Article1',
    libraryId: TEST_DATA.libraryId,
    templateId: TEST_DATA.templateId,
    parentId: TEST_DATA.siteAreaId,
    content: '<p>Article1 body</p>',
  }, { scenario_id: '4.1' });

  // 4.2 update conflict
  if (TEST_DATA.contentId) {
    callTool('update_DX_content_in_WCM', {
      contentId: TEST_DATA.contentId,
      content: `<p>Update by VU ${__VU}, iter ${__ITER}</p>`,
    }, { scenario_id: '4.2' });
  }

  // 4.3 delete while reading
  callTool('get_DX_contents_from_WCM', {
    libraryId: TEST_DATA.libraryId,
  }, { scenario_id: '4.3' });

  // 4.4 update different fields
  if (TEST_DATA.contentId) {
    callTool('update_DX_content_in_WCM', {
      contentId: TEST_DATA.contentId,
      name: `Article-renamed-${__VU}-${__ITER}`,
    }, { scenario_id: '4.4' });
  }

  // 4.5 cascading parent delete/create
  if (TEST_DATA.siteAreaId) {
    callTool('delete_site_area_from_WCM', {
      siteAreaId: TEST_DATA.siteAreaId,
    }, { scenario_id: '4.5' });
  }

  // 5.1 presentation template create
  callTool('create_presentation_template_in_WCM', {
    name: `PT-${__VU}-${__ITER}`,
    libraryId: TEST_DATA.libraryId,
    description: 'Performance test presentation template',
    content: '<div>${Body}</div>',
  }, { scenario_id: '5.1' });

  // 5.2 template delete while in use
  if (TEST_DATA.presentationTemplateId) {
    callTool('delete_presentation_template_from_WCM', {
      presentationTemplateId: TEST_DATA.presentationTemplateId,
    }, { scenario_id: '5.2' });
  }

  // 6.1 project create same name
  callTool('create_project_in_WCM', {
    name: 'Q1 Updates',
    description: 'Performance test project',
  }, { scenario_id: '6.1' });

  // 7.1 concurrent library reads
  callTool('get_all_libraries_from_WCM', {}, { scenario_id: '7.1' });

  // 7.2 read path under admin changes
  callTool('get_site_areas_from_WCM', {
    libraryId: TEST_DATA.libraryId,
  }, { scenario_id: '7.2' });
}
