@extends('template_back.content')
@section('title', 'Data Pengguna')
@section('content')

@php 
$Tanggal = new \App\Helpers\Tanggal; //panggil no static function
$Konversi = new \App\Helpers\Konversi; //panggil no static function
@endphp
<!-- container opened -->
<div class="container">

    <!-- breadcrumb -->
    <div class="breadcrumb-header justify-content-between">
        <div>
            <h4 class="content-title mb-2">Data Pengguna</h4>
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="{{route('dashboard')}}">Dashboard</a></li>
                    <li class="breadcrumb-item text-white active">Data Pengguna</li>
                </ol>
            </nav>
        </div>
    </div>
    <!-- /breadcrumb -->
    <div class="row row-sm">
        <div class="col-xl-12 col-lg-12 col-sm-12 col-md-12">
            <div class="card">
                

                <div class="pd-t-10 pd-s-10 pd-e-10 bg-white bd-b">
                    <div class="row">
                        <div class="col-md-6">
                            <p>Data Pengguna</p>
                        </div>
                        <div class="col-md-6">
                            <div class="d-flex my-auto btn-list justify-content-end">
                                <a href="{{route('data_pengguna.input')}}" class="btn btn-sm btn-primary"><i class="fa fa-plus"></i> Tambah</a>
                                <!-- <button onclick="formImport()" class="btn btn-sm btn-secondary"><i class="fa fa-upload me-2"></i> Import</button>
                                <div class="dropdown">
                                    <button type="button" class="btn btn-sm btn-success dropdown-toggle" data-bs-toggle="dropdown">
                                        <i class="fa fa-download me-2"></i>Export
                                    </button>
                                    <div class="dropdown-menu">
                                        <a class="dropdown-item" href="javascript:void(0)" onclick="exportExcel()">Excel</a>
                                        <a class="dropdown-item" href="javascript:void(0)" onclick="exportPdf()">PDF</a>
                                    </div>
                                </div> -->
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <!-- message info -->
                    @include('_component.message')
                    <div class="row">
                        <div class="col-md-3">
                            <label class="form-label mt-2 mb-0">Hak Akses</label> 
                            <select id="f1" class="form-control select2" onchange="reload_table()">
                                <option value="">=== semua ===</option>
                                <option value="1" @if(request()->get('f1')==1) selected @endif>administrator</option>
                                <option value="2" @if(request()->get('f1')==2) selected @endif>operator</option>
                            </select>
                        </div>
                    </div>
                    <hr>
                    <div class="table-responsive">
                        <table id="tbl_list" class="table table-sm table-striped table-bordered tx-14" width="100%">
                            <thead>
                                <tr>
                                    <th width="20px">No</th>
                                    <th width="20px">Nama</th>
                                    <th width="180px">Email</th>
                                    <th>Password</th>
                                    <th>Hak Akses</th>
                                    <th>Waktu Input</th>
                                    <th width="80px">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            @php $no=1; @endphp
                            @foreach($data as $dt)
                                <tr>
                                    <td>{{$no++}}</td>
                                    <td><img width="100px" height="60px" class="rounded-5" src="@if($dt->img) {{asset('')}}images/barang/{{$dt->img}} @else {{asset('')}}images/no-user.png @endif" style="object-fit:cover"> </td>
                                    <td>{{$dt->name??''}}</td>
                                    <td>{{$dt->email??''}}</td>
                                    <td>{{$dt->namerole??''}}</td>
                                    <td>{{isset($dt->created_at)?$Tanggal->inddatetime($dt->created_at??'',' '):''}}</td>
                                    <td>
                                        <form onsubmit="return confirm('Apakah Anda Yakin ?');" action="{{ route('data_pengguna.destroy', $dt->id) }}" method="POST">
                                            @csrf
                                            @method('DELETE')
                                            <a href="{{ route('data_pengguna.edit', $dt->id) }}" title="Edit" class="btn btn-info btn-sm"><i class="fa fa-edit"></i></a>
                                            <button type="submit" class="btn btn-sm btn-danger"><i class="fa fa-trash"></i></button>
                                        </form>
                                    </td>
                                </tr>
                            @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    </div>


</div>
<!-- /container -->


        <script>
            $(function() {
                // formelement
                $('.select2').select2({ width: 'resolve' });
                
                // init datatable.
                $('#tbl_list').DataTable({
                    "paging": true,
                    "lengthChange": true,
                    "searching": true,
                    "ordering": false,
                    "info": true,
                    "autoWidth": false,
                    "responsive": true,
                });

            });
            
            function reload_table(){
                var f1 =  $('#f1').val();	
                window.location.href="data_pengguna?f1="+f1;
            }

        </script>
    



@endsection